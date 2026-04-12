const DEFAULT_ELEVENLABS_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128";

export type ElevenLabsConfig = {
  apiKey: string;
  voiceId: string;
  modelId: string;
  outputFormat: string;
  baseUrl: string;
};

export function getElevenLabsConfig(): ElevenLabsConfig {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim() || "";
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY configuration.");
  }

  const configuredOutputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT?.trim();
  if (configuredOutputFormat && !configuredOutputFormat.startsWith("mp3")) {
    throw new Error("ELEVENLABS_OUTPUT_FORMAT must be an mp3 format (for example: mp3_44100_128).");
  }

  return {
    apiKey,
    voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() || DEFAULT_ELEVENLABS_VOICE_ID,
    modelId: process.env.ELEVENLABS_MODEL_ID?.trim() || DEFAULT_ELEVENLABS_MODEL_ID,
    outputFormat: configuredOutputFormat || DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
    baseUrl: process.env.ELEVENLABS_BASE_URL?.trim() || "https://api.elevenlabs.io",
  };
}
