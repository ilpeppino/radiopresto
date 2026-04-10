export type SourceItem = {
  id: string;
  url: string;
  title: string;
  publisher?: string;
  publishedAt?: string;
  excerpt?: string;
};

export type Episode = {
  id: string;
  topic: string;
  title: string;
  summary: string;
  audioUrl: string;
  durationSeconds?: number;
  createdAt: string;
  sources: SourceItem[];
};

export type GenerationStep =
  | "collecting_sources"
  | "building_bundle"
  | "generating_episode"
  | "finalizing";

export type GenerationJob = {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  step?: GenerationStep;
  errorMessage?: string;
  episodeId?: string;
};
