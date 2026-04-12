export type TtsRequest = {
  text: string;
  voiceId?: string;
  modelId?: string;
  outputFormat?: string;
};

export type TtsResult = {
  audioBytes: Uint8Array;
  mimeType: string;
  extension: string;
  durationSeconds?: number;
};

export interface TtsProvider {
  synthesize(request: TtsRequest): Promise<TtsResult>;
}
