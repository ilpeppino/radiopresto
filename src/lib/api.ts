import type { Episode, GenerationJob } from "@/src/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      if (typeof payload?.error === "string") {
        message = payload.error;
      }
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function createGenerationJob(topic: string): Promise<{ jobId: string }> {
  return request<{ jobId: string }>("/episodes/generate", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

export async function fetchGenerationJob(jobId: string): Promise<GenerationJob> {
  return request<GenerationJob>(`/generation/jobs/${jobId}`);
}

export async function fetchEpisode(episodeId: string): Promise<Episode> {
  return request<Episode>(`/episodes/${episodeId}`);
}
