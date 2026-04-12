import { ElevenLabsTtsProvider } from "./elevenlabs";
import type { TtsProvider } from "./types";

export function createTtsProvider(): TtsProvider {
  return new ElevenLabsTtsProvider();
}
