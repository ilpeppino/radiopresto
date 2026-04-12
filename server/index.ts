import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import { createTtsProvider } from "./services/tts/provider";
import { normalizeScriptForTts, validateNarrationForTts } from "./services/tts/normalize";

const CURRENT_FILE = fileURLToPath(import.meta.url);
const SERVER_DIR = path.dirname(CURRENT_FILE);
const PROJECT_ROOT = path.resolve(SERVER_DIR, "..");
dotenv.config({ path: path.join(PROJECT_ROOT, ".env.local") });
dotenv.config({ path: path.join(PROJECT_ROOT, ".env") });
dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.API_PORT ?? 3001);
const MEDIA_DIR = path.resolve("storage/audio");

const GENERATION_STEPS = [
  "collecting_sources",
  "building_bundle",
  "generating_episode",
  "finalizing",
] as const;

type GenerationStep = (typeof GENERATION_STEPS)[number];

type SourceItem = {
  id: string;
  url: string;
  title: string;
  publisher?: string;
  publishedAt?: string;
  excerpt?: string;
};

type Episode = {
  id: string;
  topic: string;
  title: string;
  summary: string;
  transcript: string;
  audioUrl: string;
  audioMimeType?: string;
  durationSeconds?: number;
  createdAt: string;
  sources: SourceItem[];
};

type GeneratedEpisode = {
  title: string;
  summary: string;
  narrationText: string;
};

type GenerationJob = {
  id: string;
  topic: string;
  status: "pending" | "running" | "completed" | "failed";
  step?: GenerationStep;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  episodeId?: string;
};

const jobs = new Map<string, GenerationJob>();
const episodes = new Map<string, Episode>();
let ttsProvider: ReturnType<typeof createTtsProvider> | null = null;

function getTtsProvider() {
  if (!ttsProvider) {
    ttsProvider = createTtsProvider();
  }
  return ttsProvider;
}

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.use("/media", express.static(MEDIA_DIR));

app.post("/episodes/generate", async (req, res) => {
  const topic = typeof req.body?.topic === "string" ? req.body.topic.trim() : "";

  if (!topic) {
    return res.status(400).json({ error: "Topic must not be empty." });
  }

  const jobId = randomUUID();
  const job: GenerationJob = {
    id: jobId,
    topic,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  jobs.set(jobId, job);

  void processJob(jobId).catch((error: unknown) => {
    failJob(jobId, error instanceof Error ? error.message : "Unknown generation failure.");
  });

  return res.status(202).json({ jobId });
});

app.get("/generation/jobs/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found." });
  }

  return res.json({
    id: job.id,
    status: job.status,
    step: job.step,
    errorMessage: job.errorMessage,
    episodeId: job.episodeId,
  });
});

app.get("/episodes/:episodeId", (req, res) => {
  const episode = episodes.get(req.params.episodeId);

  if (!episode) {
    return res.status(404).json({ error: "Episode not found." });
  }

  return res.json(episode);
});

app.listen(PORT, async () => {
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  console.log(`Radio Presto API listening on ${PORT}`);
});

async function processJob(jobId: string): Promise<void> {
  const job = jobs.get(jobId);
  if (!job) return;

  setJobState(jobId, { status: "running", step: "collecting_sources" });

  const candidates = await collectSourceCandidates(job.topic);
  if (candidates.length === 0) {
    throw new Error("No sources found for this topic.");
  }

  setJobState(jobId, { step: "building_bundle" });
  const sourceBundle = buildSourceBundle(candidates, job.topic);
  if (sourceBundle.length === 0) {
    throw new Error("No high-quality sources found for this topic.");
  }

  setJobState(jobId, { step: "generating_episode" });
  const generatedEpisode = await runPodcastfyScriptGeneration(job.topic, sourceBundle);
  const normalizedScript = normalizeScriptForTts(generatedEpisode.narrationText);
  console.info("[Pipeline] Normalized narration preview", {
    preview: previewText(normalizedScript),
    characters: normalizedScript.length,
  });
  if (!normalizedScript) {
    throw new Error("Podcastfy returned empty narration text after normalization.");
  }
  const validation = validateNarrationForTts(normalizedScript);
  if (!validation.valid) {
    throw new Error(validation.reason ?? "Narration failed validation before TTS.");
  }
  const episodeTitle = generatedEpisode.title || buildEpisodeTitle(job.topic);
  const summary = generatedEpisode.summary || buildSummary(sourceBundle);

  setJobState(jobId, { step: "finalizing" });

  const episodeId = randomUUID();
  const { audioUrl, mimeType, durationSeconds } = await synthesizeAudio(normalizedScript, episodeId);

  const episode: Episode = {
    id: episodeId,
    topic: job.topic,
    title: episodeTitle,
    summary,
    transcript: normalizedScript,
    audioUrl,
    audioMimeType: mimeType,
    durationSeconds,
    createdAt: new Date().toISOString(),
    sources: sourceBundle,
  };

  episodes.set(episodeId, episode);

  setJobState(jobId, {
    status: "completed",
    episodeId,
    completedAt: new Date().toISOString(),
    step: undefined,
  });
}

function setJobState(jobId: string, next: Partial<GenerationJob>): void {
  const job = jobs.get(jobId);
  if (!job) return;
  jobs.set(jobId, { ...job, ...next });
}

function failJob(jobId: string, message: string): void {
  const job = jobs.get(jobId);
  if (!job) return;

  jobs.set(jobId, {
    ...job,
    status: "failed",
    errorMessage: message,
    completedAt: new Date().toISOString(),
    step: undefined,
  });
}

async function collectSourceCandidates(topic: string): Promise<SourceItem[]> {
  const queries = [topic, `${topic} latest`, `${topic} analysis`];
  const collected: SourceItem[] = [];

  for (const query of queries) {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "RadioPrestoBot/1.0",
      },
    });

    if (!response.ok) {
      continue;
    }

    const rssText = await response.text();
    collected.push(...parseGoogleNewsRss(rssText));
  }

  return dedupeSources(collected).slice(0, 20);
}

function parseGoogleNewsRss(rssText: string): SourceItem[] {
  const items: SourceItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;

  for (const match of rssText.matchAll(itemRegex)) {
    const block = match[1];
    const title = decodeXml(extractTag(block, "title"));
    const url = decodeXml(extractTag(block, "link"));
    const publishedAt = decodeXml(extractTag(block, "pubDate"));
    const publisher = decodeXml(extractTag(block, "source"));

    if (!title || !url) continue;

    items.push({
      id: randomUUID(),
      title,
      url,
      publishedAt: publishedAt || undefined,
      publisher: publisher || undefined,
      excerpt: `Coverage related to ${title}`,
    });
  }

  return items;
}

function extractTag(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(regex);
  if (!match) return "";
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function dedupeSources(sources: SourceItem[]): SourceItem[] {
  const seen = new Set<string>();
  const output: SourceItem[] = [];

  for (const source of sources) {
    const key = normalizeUrl(source.url);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    output.push(source);
  }

  return output;
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    const key = `${parsed.hostname}${parsed.pathname}`.replace(/\/+$/, "");
    return key.toLowerCase();
  } catch {
    return "";
  }
}

function buildSourceBundle(sources: SourceItem[], topic: string): SourceItem[] {
  const topicLower = topic.toLowerCase();

  const scored = sources.map((source) => {
    let score = 0;
    const haystack = `${source.title} ${source.excerpt ?? ""}`.toLowerCase();

    if (haystack.includes(topicLower)) score += 2;
    if (source.publisher) score += 1;
    if (source.publishedAt) score += 1;

    return { source, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map((entry) => entry.source);
}

async function runPodcastfyScriptGeneration(topic: string, sources: SourceItem[]): Promise<GeneratedEpisode> {
  const prompt = buildFinalNarrationPrompt(topic, sources);

  const fallbackTitle = buildEpisodeTitle(topic);
  const fallbackSummary = buildSummary(sources);
  const podcastfyEndpoint = process.env.PODCASTFY_ENDPOINT_URL;
  if (podcastfyEndpoint) {
    const response = await fetch(podcastfyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, sources, prompt }),
    });

    if (response.ok) {
      const payload = (await response.json()) as unknown;
      console.info("[Podcastfy] Raw response preview", {
        preview: previewText(typeof payload === "string" ? payload : JSON.stringify(payload)),
      });
      const extracted = extractGeneratedEpisode(payload, fallbackTitle, fallbackSummary);
      if (isAcceptableNarration(extracted.narrationText)) {
        return extracted;
      }
      console.warn("[Podcastfy] Endpoint response rejected due to narration quality checks.");
    }
  }

  if (ai) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) {
      console.info("[Podcastfy] Gemini fallback output preview", {
        preview: previewText(text),
      });
      const extracted = extractGeneratedEpisode(parsePossibleJson(text), fallbackTitle, fallbackSummary);
      if (isAcceptableNarration(extracted.narrationText)) {
        return extracted;
      }
      console.warn("[Podcastfy] Gemini fallback rejected due to narration quality checks.");
    }
  }

  // Fallback keeps the flow working if Gemini is unavailable.
  const fallbackNarration = [
    `Here is your Radio Presto update on ${topic}.`,
    `Recent reporting highlights several important developments.`,
    ...sources.map((source) => `${source.title}.`),
    `Taken together, these updates show how quickly the story is evolving and why it matters right now.`,
    `We will keep tracking this topic as new reporting comes in.`,
  ].join(" ");
  console.info("[Podcastfy] Local fallback output preview", {
    preview: previewText(fallbackNarration),
  });
  return {
    title: fallbackTitle,
    summary: fallbackSummary,
    narrationText: fallbackNarration,
  };
}

function buildFinalNarrationPrompt(topic: string, sources: SourceItem[]): string {
  const nodeLabel = topic;
  const timeWindow = buildTimeWindow(sources);
  const sourceBundle = formatSourceBundleForPrompt(sources);

  return `# Radio Presto - Final Narration Generation Prompt (V1)

## ROLE

You are a professional radio journalist and podcast narrator.

Your task is to produce a short, engaging, fact-based audio segment based ONLY on the provided sources.

---

## OUTPUT FORMAT (STRICT)

You MUST return a valid JSON object with exactly this structure:

{
  "title": string,
  "summary": string,
  "narrationText": string
}

No extra fields.
No markdown.
No explanations.

---

## CRITICAL RULES FOR narrationText

The narrationText MUST:

- be written as a single narrator
- be continuous spoken prose
- sound like a radio/podcast segment
- be natural when read aloud
- be clear, engaging, and concise
- follow a logical flow (introduction -> developments -> insight -> closing)

---

## narrationText MUST NOT contain:

- any planning text
- any instructions
- any meta commentary
- any analysis of the task
- any section labels such as:
  - "Hook"
  - "Context"
  - "Main Developments"
  - "Insight"
  - "Closing"
- any dialogue or multiple speakers
- any speaker labels such as:
  - Person1 / Person2
- any bullet points
- any markdown
- any XML or tags
- any references to "sources" explicitly
- any phrases like:
  - "Here's my plan"
  - "Let's start"
  - "In this section"
  - "The article states"

---

## STYLE REQUIREMENTS

- write for listening, not reading
- vary sentence length
- avoid long, complex sentences
- avoid generic AI phrases
- avoid filler like "it is interesting to note"
- keep tone:
  - informative
  - slightly dynamic
  - confident
  - not sensational

---

## LENGTH

Target:
- 400-700 words

---

## CONTENT RULES

- use ONLY the provided sources
- do NOT invent facts
- do NOT speculate beyond what sources support
- synthesize information into a coherent narrative
- connect ideas smoothly

---

## INPUT

NODE:
${nodeLabel}

TIME WINDOW:
${timeWindow}

SOURCES:
${sourceBundle}

---

## EXAMPLE OF CORRECT narrationText

Italy is making headlines this week for reasons that go far beyond its borders. A recent attack on an oil pipeline has raised concerns about fuel supplies in southern Germany, highlighting just how interconnected European energy systems have become...

---

## FINAL INSTRUCTION

Return ONLY the JSON object.

Do NOT include:
- explanations
- planning
- analysis
- notes

Only produce the final result.`;
}

function formatSourceBundleForPrompt(sources: SourceItem[]): string {
  if (sources.length === 0) {
    return "- No sources were provided.";
  }

  return sources
    .map((source, index) => {
      const lines = [
        `${index + 1}. ${source.title}`,
        `URL: ${source.url}`,
      ];

      if (source.publisher) lines.push(`Publisher: ${source.publisher}`);
      if (source.publishedAt) lines.push(`Published: ${source.publishedAt}`);
      if (source.excerpt) lines.push(`Excerpt: ${source.excerpt}`);

      return lines.join("\n");
    })
    .join("\n\n");
}

function buildTimeWindow(sources: SourceItem[]): string {
  const timestamps = sources
    .map((source) => source.publishedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return "Not specified";
  }

  const min = new Date(Math.min(...timestamps)).toISOString();
  const max = new Date(Math.max(...timestamps)).toISOString();
  return `${min} to ${max}`;
}

function parsePossibleJson(value: string): unknown {
  const candidates = [value, stripCodeFences(value)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate);
    } catch {
      // Ignore and continue to next candidate.
    }
  }
  return value;
}

function stripCodeFences(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match?.[1]?.trim() ?? "";
}

function isAcceptableNarration(narrationText: string): boolean {
  const normalized = normalizeScriptForTts(narrationText);
  if (!normalized) {
    return false;
  }
  return validateNarrationForTts(normalized).valid;
}

function buildEpisodeTitle(topic: string): string {
  return `${topic}: Daily Brief`;
}

function buildSummary(sources: SourceItem[]): string {
  const top = sources.slice(0, 3).map((source) => source.title);
  return `A concise update based on ${sources.length} recent sources, including ${top.join("; ")}.`;
}

async function synthesizeAudio(
  script: string,
  episodeId: string,
): Promise<{ audioUrl: string; mimeType: string; durationSeconds: number }> {
  await fs.mkdir(MEDIA_DIR, { recursive: true });

  try {
    console.info("[Pipeline] TTS input preview", {
      preview: previewText(script),
      characters: script.length,
    });
    const ttsResult = await getTtsProvider().synthesize({ text: script });
    if (ttsResult.extension !== "mp3") {
      throw new Error(`TTS provider returned unsupported format: .${ttsResult.extension}`);
    }
    if (ttsResult.mimeType !== "audio/mpeg") {
      throw new Error(`TTS provider returned unsupported MIME type: ${ttsResult.mimeType}`);
    }
    const filename = `${episodeId}.${ttsResult.extension}`;
    const audioPath = path.join(MEDIA_DIR, filename);
    await fs.writeFile(audioPath, Buffer.from(ttsResult.audioBytes));

    const transcriptPath = path.join(MEDIA_DIR, `${episodeId}.txt`);
    await fs.writeFile(transcriptPath, script, "utf8");

    return {
      audioUrl: `/media/${filename}`,
      mimeType: ttsResult.mimeType,
      durationSeconds: ttsResult.durationSeconds ?? estimateDurationSeconds(script),
    };
  } catch (error) {
    throw new Error(`Audio synthesis failed: ${error instanceof Error ? error.message : "Unknown TTS error."}`);
  }
}

function estimateDurationSeconds(script: string): number {
  const words = script.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 155;
  return Math.max(30, Math.round((words / wordsPerMinute) * 60));
}

function extractGeneratedEpisode(
  payload: unknown,
  fallbackTitle: string,
  fallbackSummary: string,
): GeneratedEpisode {
  if (typeof payload === "string") {
    const parsed = parsePossibleJson(payload);
    if (parsed !== payload) {
      return extractGeneratedEpisode(parsed, fallbackTitle, fallbackSummary);
    }
    return {
      title: fallbackTitle,
      summary: fallbackSummary,
      narrationText: payload.trim(),
    };
  }

  if (!payload || typeof payload !== "object") {
    return {
      title: fallbackTitle,
      summary: fallbackSummary,
      narrationText: "",
    };
  }

  const record = payload as Record<string, unknown>;
  const title = pickFirstString(record, ["title", "episodeTitle", "headline"]) || fallbackTitle;
  const summary = pickFirstString(record, ["summary", "description", "deck"]) || fallbackSummary;
  const rawNarrationText = pickFirstString(record, [
    "narrationText",
    "script",
    "transcript",
    "text",
    "content",
  ]);
  const parsedNarration = rawNarrationText ? parsePossibleJson(rawNarrationText) : null;
  if (parsedNarration && parsedNarration !== rawNarrationText) {
    const nested = extractGeneratedEpisode(parsedNarration, title, summary);
    return {
      title: nested.title || title,
      summary: nested.summary || summary,
      narrationText: nested.narrationText?.trim() || "",
    };
  }

  return {
    title,
    summary,
    narrationText: rawNarrationText?.trim() || "",
  };
}

function pickFirstString(record: Record<string, unknown>, keys: string[]): string | null {
  const keySet = new Set(keys);
  const queue: unknown[] = [record];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || visited.has(current)) {
      continue;
    }
    visited.add(current);

    const currentRecord = current as Record<string, unknown>;
    for (const [key, value] of Object.entries(currentRecord)) {
      if (keySet.has(key) && typeof value === "string" && value.trim()) {
        return value.trim();
      }

      if (value && typeof value === "object") {
        queue.push(value);
      }
    }
  }

  return null;
}

function previewText(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 240);
}
