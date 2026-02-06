import { z } from "zod";
import {
  VoiceoverSchema,
  ScriptSchema,
  CaptionConfigSchema,
  CaptionsDataSchema,
} from "../src/types/voiceover";

export const COMP_NAME = "DynamicComp";

export const CompositionProps = z.object({
  code: z.string(),
  durationInFrames: z.number(),
  fps: z.number(),
  // Optional voiceover/script support
  voiceover: VoiceoverSchema.optional(),
  script: ScriptSchema.optional(),
  captionConfig: CaptionConfigSchema.optional(),
  captions: CaptionsDataSchema.optional(),
});
