import React from "react";
import { Audio, getInputProps } from "remotion";
import { CaptionOverlay } from "@/remotion/CaptionOverlay";
import type { Voiceover, CaptionConfig, CaptionsData } from "@/types/voiceover";

interface WrapperProps {
  voiceover?: Voiceover;
  captionConfig?: CaptionConfig;
  captions?: CaptionsData;
}

interface CompositionWrapperProps {
  AnimationComponent: React.ComponentType;
}

export const CompositionWrapper: React.FC<CompositionWrapperProps> = ({
  AnimationComponent,
}) => {
  const { voiceover, captionConfig, captions } = getInputProps() as WrapperProps;

  return (
    <>
      <AnimationComponent />
      {voiceover?.audioUrl && <Audio src={voiceover.audioUrl} />}
      {captionConfig?.enabled && captions && (
        <CaptionOverlay captionConfig={captionConfig} captions={captions} />
      )}
    </>
  );
};

// Factory function to create a wrapped component
export function createWrappedComponent(
  AnimationComponent: React.ComponentType
): React.ComponentType {
  const WrappedComponent: React.FC = () => (
    <CompositionWrapper AnimationComponent={AnimationComponent} />
  );
  WrappedComponent.displayName = "WrappedComposition";
  return WrappedComponent;
}
