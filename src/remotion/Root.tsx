import React from "react";
import { Composition } from "remotion";
import { DynamicComp } from "./DynamicComp";
import { HeroBanner } from "./HeroBanner";

const defaultCode = `import { AbsoluteFill } from "remotion";
export const MyAnimation = () => <AbsoluteFill style={{ backgroundColor: "#000" }} />;`;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicComp"
        component={DynamicComp}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ code: defaultCode }}
        calculateMetadata={({ props }) => {
          let duration = props.durationInFrames as number;
          const fps = props.fps as number;

          // Use audio duration if voiceover is provided
          const voiceover = props.voiceover as { durationMs?: number } | undefined;
          if (voiceover?.durationMs) {
            duration = Math.ceil((voiceover.durationMs / 1000) * fps);
          }

          return { durationInFrames: duration, fps };
        }}
      />
      <Composition
        id="HeroBanner"
        component={HeroBanner}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
