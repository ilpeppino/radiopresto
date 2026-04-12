const FORBIDDEN_PATTERNS: RegExp[] = [
  /\bhere'?s my plan\b/i,
  /\blet'?s start\b/i,
  /\banalyze input content\b/i,
  /\bconversation setup\b/i,
  /\btopic exploration\b/i,
  /\bdialogue structure\b/i,
  /\bstructure the podcast\b/i,
  /\bpodcast conversation\b/i,
  /\bpersona\s*&\s*style\b/i,
  /\bword count management\b/i,
  /\bself-correction\b/i,
  /\bavoid saying\b/i,
  /\bstart drafting\b/i,
  /\bkey players\s*:/i,
  /\bconstraint checklist\b/i,
  /\bconfidence score\b/i,
  /\bstrategizing complete\b/i,
  /\bgeneration instructions\b/i,
  /\brequired structure\b/i,
  /\bstructure plan\b/i,
  /\btts optimization\b/i,
  /\bkey information from sources\b/i,
  /\bthe user wants\b/i,
  /\(scratchpad\)/i,
  /<(?:\/)?person[12]\s*>/i,
];

const LABEL_PREFIX_PATTERN =
  /\b(hook|context|main developments?|insight|closing|topic|sources|rules|output contract|summary)\s*:\s*/gi;

const SPEAKER_PREFIX_PATTERN = /^(?:<\s*)?person\s*[12](?:\s*>)?\s*[:\-]\s*/i;

const META_ONLY_LINE_PATTERN = new RegExp(
  [
    "^\\s*analyze input content\\s*$",
    "^\\s*conversation setup\\s*$",
    "^\\s*topic exploration\\s*$",
    "^\\s*dialogue structure\\s*$",
    "^\\s*constraint checklist\\s*$",
    "^\\s*confidence score\\s*:?\\s*\\d*\\s*$",
    "^\\s*strategizing complete\\s*$",
    "^\\s*source[s]?\\s*:\\s*$",
    "^\\s*rules\\s*:\\s*$",
  ].join("|"),
  "i",
);

type NarrationValidationResult = {
  valid: boolean;
  reason?: string;
};

export function normalizeScriptForTts(script: string): string {
  const flattened = script
    .replace(/\r\n/g, "\n")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<(?:\/)?person[12]\s*>/gi, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!flattened) {
    return "";
  }

  const cleanedLines = flattened
    .split("\n")
    .map((line) => line.trim())
    .map((line) => line.replace(/^\s*[-*]\s+/, ""))
    .map((line) => line.replace(SPEAKER_PREFIX_PATTERN, ""))
    .map((line) => line.replace(LABEL_PREFIX_PATTERN, ""))
    .map((line) => line.replace(/^\s*\[[^\]]+\]\s*:?/g, ""))
    .map((line) => line.replace(/<\/?[^>]+>/g, ""))
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !META_ONLY_LINE_PATTERN.test(line))
    .filter((line) => !FORBIDDEN_PATTERNS.some((pattern) => pattern.test(line)))
    .filter((line) => !/^(url|published|publisher|excerpt)\s*:/i.test(line));

  const narration = cleanedLines.join(" ").replace(/\s+/g, " ").trim();
  return narration;
}

export function validateNarrationForTts(narrationText: string): NarrationValidationResult {
  const text = narrationText.trim();
  if (!text) {
    return { valid: false, reason: "Narration is empty after normalization." };
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 35) {
    return { valid: false, reason: "Narration is too short to be meaningful." };
  }

  if (FORBIDDEN_PATTERNS.some((pattern) => pattern.test(text))) {
    return { valid: false, reason: "Narration still contains forbidden prompt leakage." };
  }

  if (/^\s*[-*]\s+/m.test(text) || /^\s*\d+\.\s+/m.test(text) || /^\s*#{1,6}\s+/m.test(text)) {
    return { valid: false, reason: "Narration still contains markdown/list structure." };
  }

  if (SPEAKER_PREFIX_PATTERN.test(text) || /<(?:\/)?person[12]\s*>/i.test(text)) {
    return { valid: false, reason: "Narration contains multi-speaker tags." };
  }

  if (/<\/?[^>]+>/.test(text)) {
    return { valid: false, reason: "Narration contains XML-like tags." };
  }

  if (!/[.!?]/.test(text)) {
    return { valid: false, reason: "Narration does not read as spoken prose." };
  }

  return { valid: true };
}
