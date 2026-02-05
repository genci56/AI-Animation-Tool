"use client";

import { useState, useRef, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  Upload,
  X,
  Volume2,
  Captions,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Voiceover, CaptionConfig, CaptionsData, Script } from "@/types/voiceover";

interface VoiceoverPanelProps {
  voiceover: Voiceover | null;
  onVoiceoverChange: (voiceover: Voiceover | null) => void;
  captionConfig: CaptionConfig;
  onCaptionConfigChange: (config: CaptionConfig) => void;
  onCaptionsChange?: (captions: CaptionsData | null) => void;
  onScriptChange?: (script: Script) => void;
}

export function VoiceoverPanel({
  voiceover,
  onVoiceoverChange,
  captionConfig,
  onCaptionConfigChange,
  onCaptionsChange,
  onScriptChange,
}: VoiceoverPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        resolve(Math.round(audio.duration * 1000));
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audio.src);
        reject(new Error("Failed to load audio metadata"));
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setUploadError(null);

      try {
        // Get duration from the file before uploading
        const durationMs = await getAudioDuration(file);

        // Upload the file
        const formData = new FormData();
        formData.append("audio", file);

        const response = await fetch("/api/upload-audio", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const { audioUrl } = await response.json();

        setFilename(file.name);
        onVoiceoverChange({
          audioUrl,
          durationMs,
        });
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload audio"
        );
      } finally {
        setIsUploading(false);
        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [onVoiceoverChange]
  );

  const handleRemoveAudio = useCallback(async () => {
    if (voiceover?.audioUrl) {
      // Extract filename from URL
      const urlFilename = voiceover.audioUrl.split("/").pop();
      if (urlFilename) {
        try {
          await fetch(`/api/upload-audio?filename=${urlFilename}`, {
            method: "DELETE",
          });
        } catch {
          // Ignore deletion errors
        }
      }
    }
    setFilename(null);
    onVoiceoverChange(null);
  }, [voiceover, onVoiceoverChange]);

  const handleCaptionToggle = useCallback(() => {
    onCaptionConfigChange({
      ...captionConfig,
      enabled: !captionConfig.enabled,
    });
  }, [captionConfig, onCaptionConfigChange]);

  const handleStyleChange = useCallback(
    (style: "bottom" | "center" | "karaoke") => {
      onCaptionConfigChange({
        ...captionConfig,
        style,
      });
    },
    [captionConfig, onCaptionConfigChange]
  );

  const handleTranscribe = useCallback(async () => {
    if (!voiceover?.audioUrl) return;

    setIsTranscribing(true);
    setTranscribeError(null);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: voiceover.audioUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Transcription failed");
      }

      const { words, scenes } = await response.json();

      // Update captions
      if (onCaptionsChange && words?.length > 0) {
        onCaptionsChange({ words });
        // Auto-enable captions
        onCaptionConfigChange({
          ...captionConfig,
          enabled: true,
        });
      }

      // Update script with detected scenes
      if (onScriptChange && scenes?.length > 0) {
        onScriptChange({ scenes });
      }
    } catch (error) {
      setTranscribeError(
        error instanceof Error ? error.message : "Transcription failed"
      );
    } finally {
      setIsTranscribing(false);
    }
  }, [voiceover, onCaptionsChange, onScriptChange, captionConfig, onCaptionConfigChange]);

  return (
    <div className="border-b border-border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Voiceover</span>
        </div>
        {voiceover && (
          <span className="text-xs text-muted-foreground">
            {formatDuration(voiceover.durationMs)}
          </span>
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Audio Upload */}
          {!voiceover ? (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer"
                  loading={isUploading}
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                    {isUploading ? "Uploading..." : "Upload Audio"}
                  </span>
                </Button>
              </label>
              {uploadError && (
                <p className="text-xs text-destructive">{uploadError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                MP3, WAV, OGG, WebM, AAC, M4A
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate">
                    {filename || "Audio file"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRemoveAudio}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Transcribe Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleTranscribe}
                disabled={isTranscribing}
                className="w-full"
              >
                <Wand2 className="w-4 h-4" />
                {isTranscribing ? "Transcribing..." : "Auto-detect Captions & Scenes"}
              </Button>
              {transcribeError && (
                <p className="text-xs text-destructive">{transcribeError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Uses local Whisper AI to transcribe audio
              </p>
            </div>
          )}

          {/* Captions Section */}
          {voiceover && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Captions className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Captions</span>
                </div>
                <button
                  onClick={handleCaptionToggle}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    captionConfig.enabled ? "bg-primary" : "bg-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform",
                      captionConfig.enabled ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Caption Style Options */}
              {captionConfig.enabled && (
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">Style</span>
                  <div className="flex gap-2">
                    {(["bottom", "center", "karaoke"] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => handleStyleChange(style)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-md transition-colors capitalize",
                          captionConfig.style === style
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
