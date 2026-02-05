import { z } from "zod";

// Scene in a script
export const SceneSchema = z.object({
  id: z.string(),
  text: z.string(), // Voiceover text
  startMs: z.number().optional(), // Start time (ms)
  endMs: z.number().optional(), // End time (ms)
  visualHint: z.string().optional(), // Hint for visuals
});

export type Scene = z.infer<typeof SceneSchema>;

// Full script
export const ScriptSchema = z.object({
  scenes: z.array(SceneSchema),
  totalDurationMs: z.number().optional(),
});

export type Script = z.infer<typeof ScriptSchema>;

// Voiceover config
export const VoiceoverSchema = z.object({
  audioUrl: z.string(),
  durationMs: z.number(),
});

export type Voiceover = z.infer<typeof VoiceoverSchema>;

// Caption config (opt-in)
export const CaptionConfigSchema = z.object({
  enabled: z.boolean().default(false),
  style: z.enum(["bottom", "center", "karaoke"]).default("bottom"),
  fontSize: z.number().default(48),
  highlightColor: z.string().default("#FFFF00"),
});

export type CaptionConfig = z.infer<typeof CaptionConfigSchema>;

// Caption word timing
export const CaptionWordSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
});

export type CaptionWord = z.infer<typeof CaptionWordSchema>;

export const CaptionsDataSchema = z.object({
  words: z.array(CaptionWordSchema),
});

export type CaptionsData = z.infer<typeof CaptionsDataSchema>;
