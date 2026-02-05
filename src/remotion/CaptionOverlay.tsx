import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import type { CaptionConfig, CaptionsData } from "../types/voiceover";

interface CaptionOverlayProps {
  captionConfig: CaptionConfig;
  captions: CaptionsData;
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  captionConfig,
  captions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!captionConfig.enabled || !captions.words.length) {
    return null;
  }

  const currentTimeMs = (frame / fps) * 1000;

  // Find words that should be visible at the current time
  // For karaoke style, show a window of words around the current word
  // For bottom/center style, show the current phrase
  const activeWordIndex = captions.words.findIndex(
    (word) => currentTimeMs >= word.startMs && currentTimeMs <= word.endMs
  );

  // Get context window of words to display (7 words centered on active word)
  const windowSize = 7;
  const halfWindow = Math.floor(windowSize / 2);

  let startIndex = 0;
  let endIndex = captions.words.length;

  if (captionConfig.style === "karaoke") {
    // For karaoke, show a sliding window of words
    if (activeWordIndex !== -1) {
      startIndex = Math.max(0, activeWordIndex - halfWindow);
      endIndex = Math.min(captions.words.length, activeWordIndex + halfWindow + 1);
    } else {
      // Find the next upcoming word
      const nextWordIndex = captions.words.findIndex(
        (word) => word.startMs > currentTimeMs
      );
      if (nextWordIndex !== -1) {
        startIndex = Math.max(0, nextWordIndex - halfWindow);
        endIndex = Math.min(captions.words.length, nextWordIndex + halfWindow + 1);
      }
    }
  } else {
    // For bottom/center, show words in the current time window
    // Group words into phrases based on timing gaps
    const phraseGapMs = 500; // Gap threshold to split phrases
    let phraseStart = 0;
    let phraseEnd = captions.words.length;

    for (let i = 0; i < captions.words.length; i++) {
      const word = captions.words[i];
      const prevWord = i > 0 ? captions.words[i - 1] : null;

      // Start new phrase if there's a gap
      if (prevWord && word.startMs - prevWord.endMs > phraseGapMs) {
        if (currentTimeMs >= prevWord.endMs && currentTimeMs < word.startMs) {
          // We're in the gap, don't show anything
          return null;
        }
        if (currentTimeMs >= word.startMs) {
          phraseStart = i;
        }
      }

      // End phrase if there's a gap after this word
      const nextWord = i < captions.words.length - 1 ? captions.words[i + 1] : null;
      if (nextWord && nextWord.startMs - word.endMs > phraseGapMs) {
        if (currentTimeMs <= word.endMs) {
          phraseEnd = i + 1;
          break;
        }
      }
    }

    startIndex = phraseStart;
    endIndex = Math.min(phraseEnd, phraseStart + 10); // Limit to 10 words per phrase
  }

  const visibleWords = captions.words.slice(startIndex, endIndex);

  if (visibleWords.length === 0) {
    return null;
  }

  // Position based on style
  const getContainerStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      padding: "20px 40px",
      maxWidth: "80%",
    };

    switch (captionConfig.style) {
      case "center":
        return {
          ...base,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
      case "karaoke":
        return {
          ...base,
          position: "absolute",
          bottom: "15%",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom":
      default:
        return {
          ...base,
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
        };
    }
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={getContainerStyle()}>
        {visibleWords.map((word, index) => {
          const globalIndex = startIndex + index;
          const isActive =
            currentTimeMs >= word.startMs && currentTimeMs <= word.endMs;
          const isPast = currentTimeMs > word.endMs;

          // Calculate progress for karaoke highlight animation
          let highlightProgress = 0;
          if (isActive) {
            highlightProgress =
              (currentTimeMs - word.startMs) / (word.endMs - word.startMs);
          } else if (isPast) {
            highlightProgress = 1;
          }

          const wordStyle: React.CSSProperties = {
            fontSize: captionConfig.fontSize,
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            transition: "color 0.1s ease",
          };

          if (captionConfig.style === "karaoke") {
            // Karaoke style: partial highlight based on progress
            return (
              <span
                key={globalIndex}
                style={{
                  ...wordStyle,
                  position: "relative",
                  color: "white",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    color: captionConfig.highlightColor,
                    clipPath: `inset(0 ${100 - highlightProgress * 100}% 0 0)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {word.text}
                </span>
                {word.text}
              </span>
            );
          }

          // Bottom/center style: full word highlight
          return (
            <span
              key={globalIndex}
              style={{
                ...wordStyle,
                color: isActive
                  ? captionConfig.highlightColor
                  : isPast
                    ? "rgba(255, 255, 255, 0.7)"
                    : "white",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
