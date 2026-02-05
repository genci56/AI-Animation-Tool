import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const HeroBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 45,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a1628",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          fontSize: 120,
          fontWeight: "bold",
          fontFamily: "sans-serif",
          letterSpacing: 8,
          transform: `scale(${scale})`,
        }}
      >
        AI REVOLUTION
      </h1>
    </AbsoluteFill>
  );
};
