import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { promises as fs } from "node:fs";

const execFileAsync = promisify(execFile);

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.API_PORT ?? 3001);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
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
  audioUrl: string;
  durationSeconds?: number;
  createdAt: string;
  sources: SourceItem[];
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
  const script = await runPodcastfyScriptGeneration(job.topic, sourceBundle);
  const episodeTitle = buildEpisodeTitle(job.topic);
  const summary = buildSummary(sourceBundle);

  setJobState(jobId, { step: "finalizing" });

  const episodeId = randomUUID();
  const { filename, durationSeconds } = await synthesizeAudio(script, episodeId);

  const episode: Episode = {
    id: episodeId,
    topic: job.topic,
    title: episodeTitle,
    summary,
    audioUrl: `${APP_URL}/media/${filename}`,
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

async function runPodcastfyScriptGeneration(topic: string, sources: SourceItem[]): Promise<string> {
  const sourceList = sources
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

  const prompt = `You are the Radio Presto Podcastfy writer. Generate a 600-700 word podcast script in natural spoken English.
Use ONLY the provided sources.

Topic: ${topic}

Required structure:
1) Hook
2) Context
3) Main developments
4) Insight
5) Closing

Rules:
- No generic AI phrases.
- No repetition.
- Keep transitions smooth.
- Do not mention source URLs in narration.
- Keep it suitable for text-to-speech delivery.

Sources:\n${sourceList}`;

  const podcastfyEndpoint = process.env.PODCASTFY_ENDPOINT_URL;
  if (podcastfyEndpoint) {
    const response = await fetch(podcastfyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, sources, prompt }),
    });

    if (response.ok) {
      const payload = (await response.json()) as { script?: string };
      if (typeof payload.script === "string" && payload.script.trim()) {
        return payload.script.trim();
      }
    }
  }

  if (ai) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) return text;
  }

  // Fallback keeps the flow working if Gemini is unavailable.
  return [
    `Here is your Radio Presto update on ${topic}.`,
    `Recent reporting highlights several important developments.`,
    ...sources.map((source) => `${source.title}.`),
    `Taken together, these updates show how quickly the story is evolving and why it matters right now.`,
    `We will keep tracking this topic as new reporting comes in.`,
  ].join(" ");
}

function buildEpisodeTitle(topic: string): string {
  return `${topic}: Daily Brief`;
}

function buildSummary(sources: SourceItem[]): string {
  const top = sources.slice(0, 3).map((source) => source.title);
  return `A concise update based on ${sources.length} recent sources, including ${top.join("; ")}.`;
}

async function synthesizeAudio(script: string, episodeId: string): Promise<{ filename: string; durationSeconds: number }> {
  const filename = `${episodeId}.aiff`;
  const outputPath = path.join(MEDIA_DIR, filename);

  await fs.mkdir(MEDIA_DIR, { recursive: true });

  try {
    await execFileAsync("say", [
      "-v",
      process.env.TTS_VOICE ?? "Samantha",
      "-r",
      process.env.TTS_RATE ?? "185",
      "-o",
      outputPath,
      script,
    ]);
  } catch (error) {
    throw new Error(
      `Audio synthesis failed. Ensure macOS 'say' is available and the topic is valid. ${
        error instanceof Error ? error.message : ""
      }`,
    );
  }

  return {
    filename,
    durationSeconds: estimateDurationSeconds(script),
  };
}

function estimateDurationSeconds(script: string): number {
  const words = script.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 155;
  return Math.max(30, Math.round((words / wordsPerMinute) * 60));
}
