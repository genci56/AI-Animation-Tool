import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";
import { mkdir, unlink } from "fs/promises";
import { execSync } from "child_process";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  convertToCaptions,
} from "@remotion/install-whisper-cpp";

const WHISPER_DIR = path.join(process.cwd(), ".whisper");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Model to use - "tiny" is fastest, "base" is good balance
// Available: "tiny", "tiny.en", "base", "base.en", "small", "small.en", "medium", "medium.en", "large-v1", "large-v2", "large-v3", "large-v3-turbo"
const WHISPER_MODEL = "base" as const;

// Convert audio to 16kHz WAV format required by whisper.cpp
async function convertToWav(inputPath: string): Promise<string> {
  const outputPath = inputPath.replace(/\.[^.]+$/, "_converted.wav");

  // Check if already a valid WAV file (skip conversion)
  if (inputPath.toLowerCase().endsWith(".wav")) {
    // Still need to ensure it's 16kHz mono
    try {
      execSync(`ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -y "${outputPath}"`, {
        stdio: "pipe",
      });
      return outputPath;
    } catch {
      // If ffmpeg fails, try using the original file
      return inputPath;
    }
  }

  // Convert mp3/other formats to 16kHz mono WAV
  try {
    execSync(`ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -y "${outputPath}"`, {
      stdio: "pipe",
    });
    return outputPath;
  } catch (error) {
    throw new Error(
      "Failed to convert audio. Please ensure ffmpeg is installed. " +
      "Download from: https://ffmpeg.org/download.html"
    );
  }
}

// Ensure whisper is installed and model downloaded
async function ensureWhisperReady(): Promise<{ whisperPath: string; modelFolder: string }> {
  // Create whisper directory if needed
  if (!existsSync(WHISPER_DIR)) {
    await mkdir(WHISPER_DIR, { recursive: true });
  }

  // Install whisper.cpp if not already installed
  const whisperPath = path.join(WHISPER_DIR, "whisper.cpp");
  if (!existsSync(whisperPath)) {
    console.log("Installing whisper.cpp...");
    await installWhisperCpp({
      to: whisperPath,
      version: "1.5.5",
    });
    console.log("Whisper.cpp installed successfully");
  }

  // Download model if not already downloaded
  const modelPath = path.join(WHISPER_DIR, `ggml-${WHISPER_MODEL}.bin`);
  if (!existsSync(modelPath)) {
    console.log(`Downloading whisper model: ${WHISPER_MODEL}...`);
    await downloadWhisperModel({
      model: WHISPER_MODEL,
      folder: WHISPER_DIR,
    });
    console.log("Model downloaded successfully");
  }

  return { whisperPath, modelFolder: WHISPER_DIR };
}

export async function POST(request: NextRequest) {
  try {
    const { audioUrl } = await request.json();

    if (!audioUrl) {
      return NextResponse.json(
        { error: "No audio URL provided" },
        { status: 400 }
      );
    }

    // Get the audio file path
    const audioFilename = audioUrl.replace("/uploads/", "");
    const audioPath = path.join(UPLOADS_DIR, audioFilename);

    if (!existsSync(audioPath)) {
      return NextResponse.json(
        { error: "Audio file not found" },
        { status: 404 }
      );
    }

    // Ensure whisper is ready
    const { whisperPath, modelFolder } = await ensureWhisperReady();

    // Convert audio to 16kHz WAV format (required by whisper.cpp)
    console.log("Converting audio to WAV format...");
    let wavPath: string;
    let needsCleanup = false;
    try {
      wavPath = await convertToWav(audioPath);
      needsCleanup = wavPath !== audioPath;
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Audio conversion failed",
        },
        { status: 500 }
      );
    }

    console.log("Starting transcription...");

    // Transcribe the audio
    const { transcription } = await transcribe({
      inputPath: wavPath,
      whisperPath,
      whisperCppVersion: "1.5.5",
      model: WHISPER_MODEL,
      modelFolder,
      tokenLevelTimestamps: true,
    });

    // Clean up converted file
    if (needsCleanup && existsSync(wavPath)) {
      await unlink(wavPath);
    }

    console.log("Transcription complete, converting to captions...");

    // Convert to captions format
    const { captions } = convertToCaptions({
      transcription,
      combineTokensWithinMilliseconds: 200,
    });

    // Convert to our CaptionsData format
    // The captions from convertToCaptions only have startInSeconds, calculate endMs from next word
    const words = captions.map((caption, index) => {
      const startMs = Math.round(caption.startInSeconds * 1000);
      // End time is the start of the next word, or estimate based on word length
      const nextCaption = captions[index + 1];
      const endMs = nextCaption
        ? Math.round(nextCaption.startInSeconds * 1000) - 50 // Small gap before next word
        : startMs + Math.max(300, caption.text.length * 80); // Estimate: ~80ms per character
      return {
        text: caption.text,
        startMs,
        endMs,
      };
    });

    // Also create scenes based on sentence boundaries (periods, long pauses)
    const scenes = createScenesFromWords(words);

    return NextResponse.json({
      words,
      scenes,
      rawTranscription: transcription,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Transcription failed",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

interface Word {
  text: string;
  startMs: number;
  endMs: number;
}

interface Scene {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  visualHint: string;
}

// Create scenes from words based on sentence boundaries
function createScenesFromWords(words: Word[]): Scene[] {
  const scenes: Scene[] = [];
  let currentSceneText = "";
  let currentSceneStart = 0;
  let lastEndMs = 0;

  const PAUSE_THRESHOLD_MS = 1000; // 1 second pause = new scene

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isFirstWord = currentSceneText === "";
    const isPauseBreak = word.startMs - lastEndMs > PAUSE_THRESHOLD_MS;
    const isSentenceEnd = /[.!?]$/.test(word.text.trim());

    if (isFirstWord) {
      currentSceneStart = word.startMs;
    }

    // Check if we should start a new scene
    if (!isFirstWord && isPauseBreak) {
      // Save current scene
      if (currentSceneText.trim()) {
        scenes.push({
          id: `scene-${scenes.length + 1}`,
          text: currentSceneText.trim(),
          startMs: currentSceneStart,
          endMs: lastEndMs,
          visualHint: "",
        });
      }
      // Start new scene
      currentSceneText = word.text;
      currentSceneStart = word.startMs;
    } else {
      // Add to current scene
      currentSceneText += (currentSceneText ? " " : "") + word.text;
    }

    // If sentence ends, consider ending scene
    if (isSentenceEnd && currentSceneText.split(" ").length >= 5) {
      scenes.push({
        id: `scene-${scenes.length + 1}`,
        text: currentSceneText.trim(),
        startMs: currentSceneStart,
        endMs: word.endMs,
        visualHint: "",
      });
      currentSceneText = "";
    }

    lastEndMs = word.endMs;
  }

  // Don't forget the last scene
  if (currentSceneText.trim()) {
    scenes.push({
      id: `scene-${scenes.length + 1}`,
      text: currentSceneText.trim(),
      startMs: currentSceneStart,
      endMs: lastEndMs,
      visualHint: "",
    });
  }

  return scenes;
}
