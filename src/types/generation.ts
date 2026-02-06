export const MODELS = [
  { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Fast)" },
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
] as const;

export type ModelId = (typeof MODELS)[number]["id"];

export type StreamPhase = "idle" | "reasoning" | "generating";

export type GenerationErrorType = "validation" | "api";
