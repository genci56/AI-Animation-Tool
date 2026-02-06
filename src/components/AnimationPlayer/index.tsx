"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Player, type ErrorFallback, type PlayerRef } from "@remotion/player";
import { ErrorDisplay, type ErrorType } from "../ErrorDisplay";
import { RenderControls } from "./RenderControls";
import { SettingsModal } from "./SettingsModal";
import { createWrappedComponent } from "./CompositionWrapper";
import type { Voiceover, CaptionConfig, CaptionsData } from "@/types/voiceover";

const renderErrorFallback: ErrorFallback = ({ error }) => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-background-error p-10">
      <div className="text-center max-w-[80%]">
        <div className="text-destructive text-3xl font-bold mb-4 font-sans">
          Runtime Error
        </div>
        <div className="text-destructive-foreground text-xl font-mono whitespace-pre-wrap break-words">
          {error.message || "An error occurred while rendering"}
        </div>
      </div>
    </div>
  );
};

interface AnimationPlayerProps {
  Component: React.ComponentType | null;
  durationInFrames: number;
  fps: number;
  onDurationChange: (duration: number) => void;
  onFpsChange: (fps: number) => void;
  isCompiling: boolean;
  isStreaming: boolean;
  error: string | null;
  errorType?: ErrorType;
  code: string;
  onRuntimeError?: (error: string) => void;
  // Voiceover/caption support
  voiceover?: Voiceover | null;
  captionConfig?: CaptionConfig;
  captions?: CaptionsData | null;
}

export const AnimationPlayer: React.FC<AnimationPlayerProps> = ({
  Component,
  durationInFrames,
  fps,
  onDurationChange,
  onFpsChange,
  isCompiling,
  isStreaming,
  error,
  errorType = "compilation",
  code,
  onRuntimeError,
  voiceover,
  captionConfig,
  captions,
}) => {
  const playerRef = useRef<PlayerRef>(null);

  // Create wrapped component that includes audio and captions
  const WrappedComponent = useMemo(() => {
    if (!Component) return null;
    // Only wrap if we have voiceover or captions to add
    if (voiceover || (captionConfig?.enabled && captions)) {
      return createWrappedComponent(Component);
    }
    return Component;
  }, [Component, voiceover, captionConfig?.enabled, captions]);

  // Listen for runtime errors from the Player's error boundary
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !onRuntimeError) return;

    const handleError = (e: { detail: { error: Error } }) => {
      onRuntimeError(e.detail.error.message);
    };

    player.addEventListener("error", handleError);
    return () => {
      player.removeEventListener("error", handleError);
    };
  }, [onRuntimeError]);

  const renderContent = () => {
    if (isStreaming) {
      return (
        <div className="w-full aspect-video max-h-[calc(100%-80px)] flex flex-col justify-center items-center gap-4 bg-background-elevated rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">
            Waiting for code generation to finish...
          </p>
        </div>
      );
    }

    if (isCompiling) {
      return (
        <div className="w-full aspect-video max-h-[calc(100%-80px)] flex justify-center items-center bg-background-elevated rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" />
        </div>
      );
    }

    if (error) {
      return <ErrorDisplay error={error} errorType={errorType} />;
    }

    if (!WrappedComponent) {
      return (
        <div className="w-full aspect-video max-h-[calc(100%-80px)] flex flex-col justify-center items-center gap-3 bg-background-elevated rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="text-muted-foreground text-lg font-sans">
            Describe your animation
          </div>
          <div className="text-muted-foreground-dim text-sm font-sans">
            Type a prompt in the chat to generate a video
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="w-full aspect-video max-h-[calc(100%-80px)] rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <Player
            ref={playerRef}
            key={`${Component?.toString()}-${voiceover?.audioUrl || "no-audio"}`}
            component={WrappedComponent}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionHeight={1080}
            compositionWidth={1920}
            inputProps={{
              voiceover: voiceover || undefined,
              captionConfig: captionConfig || undefined,
              captions: captions || undefined,
            }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            }}
            controls
            autoPlay
            loop
            errorFallback={renderErrorFallback}
            spaceKeyToPlayOrPause={false}
            clickToPlay={false}
          />
        </div>
        <div className="flex items-center justify-between gap-6">
          <RenderControls code={code} durationInFrames={durationInFrames} fps={fps} />
          <SettingsModal
            durationInFrames={durationInFrames}
            onDurationChange={onDurationChange}
            fps={fps}
            onFpsChange={onFpsChange}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col bg-background min-w-0 h-full">
      <div className="w-full h-full flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground shrink-0">
          Video Preview
        </h2>
        {renderContent()}
      </div>
    </div>
  );
};
