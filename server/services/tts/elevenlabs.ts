import { getElevenLabsConfig } from "../../config/elevenlabs";
import type { TtsProvider, TtsRequest, TtsResult } from "./types";

function resolveOutput(outputFormat: string): { extension: string; mimeType: string } {
  if (outputFormat.startsWith("mp3")) {
    return { extension: "mp3", mimeType: "audio/mpeg" };
  }

  if (outputFormat.startsWith("pcm")) {
    return { extension: "pcm", mimeType: "audio/pcm" };
  }

  if (outputFormat.startsWith("ulaw")) {
    return { extension: "ulaw", mimeType: "audio/basic" };
  }

  return { extension: "bin", mimeType: "application/octet-stream" };
}

function resolveMimeFromHeader(contentType: string | null): string | null {
  if (!contentType) return null;
  const normalized = contentType.split(";")[0]?.trim().toLowerCase();
  if (!normalized) return null;
  return normalized;
}

export class ElevenLabsTtsProvider implements TtsProvider {
  private readonly config = getElevenLabsConfig();

  async synthesize(request: TtsRequest): Promise<TtsResult> {
    const text = request.text.trim();
    if (!text) {
      throw new Error("Cannot synthesize empty script text.");
    }

    const voiceId = request.voiceId ?? this.config.voiceId;
    const modelId = request.modelId ?? this.config.modelId;
    const outputFormat = request.outputFormat ?? this.config.outputFormat;
    const outputInfo = resolveOutput(outputFormat);

    const endpoint = new URL(
      `/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`,
      this.config.baseUrl,
    );

    console.info("[TTS] ElevenLabs synth request", {
      voiceId,
      modelId,
      outputFormat,
      characters: text.length,
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": this.config.apiKey,
        Accept: outputInfo.mimeType,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
      }),
    });

    if (!response.ok) {
      const rawError = await response.text().catch(() => "");
      const message = rawError.slice(0, 300) || `HTTP ${response.status}`;
      console.error("[TTS] ElevenLabs synth failed", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`ElevenLabs request failed (${response.status}): ${message}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBytes = new Uint8Array(arrayBuffer);
    const headerMimeType = resolveMimeFromHeader(response.headers.get("content-type"));

    if (audioBytes.byteLength === 0) {
      throw new Error("ElevenLabs returned empty audio output.");
    }

    return {
      audioBytes,
      mimeType: headerMimeType || outputInfo.mimeType,
      extension: outputInfo.extension,
    };
  }
}
