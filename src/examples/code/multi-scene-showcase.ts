import { RemotionExample } from "./index";

export const multiSceneShowcaseCode = `import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";

// Scene 1: Intro with animated title
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Title entrance with elastic easing (bouncy overshoot)
  const titleProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.7)), // Overshoot then settle
  });

  const titleY = interpolate(titleProgress, [0, 1], [100, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleScale = interpolate(titleProgress, [0, 1], [0.6, 1]);

  // Subtitle with smooth ease-out
  const subtitleProgress = interpolate(frame - 20, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const subtitleOpacity = subtitleProgress;
  const subtitleY = interpolate(subtitleProgress, [0, 1], [40, 0]);

  // Animated gradient background
  const gradientRotation = interpolate(frame, [0, 120], [0, 360]);

  // Floating particles
  const particles = Array.from({ length: 8 }, (_, i) => {
    const delay = i * 5;
    const particleProgress = spring({
      frame: frame - delay,
      fps,
      config: { damping: 20, stiffness: 80 },
    });
    const baseX = (i % 4) * (width / 4) + width / 8;
    const baseY = Math.floor(i / 4) * (height / 2) + height / 4;
    const floatY = Math.sin((frame + i * 20) / 20) * 15;
    const particleOpacity = interpolate(particleProgress, [0, 1], [0, 0.6], {
      extrapolateLeft: "clamp",
    });
    return { x: baseX, y: baseY + floatY, opacity: particleOpacity, size: 8 + (i % 3) * 4 };
  });

  return (
    <AbsoluteFill
      style={{
        background: \`linear-gradient(\${gradientRotation}deg, #1a1a2e, #16213e, #0f3460)\`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.8)",
            opacity: p.opacity,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}

      {/* Main title */}
      <h1
        style={{
          fontSize: Math.round(width * 0.08),
          fontWeight: 900,
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          margin: 0,
          opacity: titleOpacity,
          transform: \`translateY(\${titleY}px) scale(\${titleScale})\`,
          textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          letterSpacing: -2,
        }}
      >
        IMSOLD ANIMATOR
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: Math.round(width * 0.025),
          color: "#94a3b8",
          fontFamily: "Inter, sans-serif",
          marginTop: 20,
          opacity: subtitleOpacity,
          transform: \`translateY(\${subtitleY}px)\`,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        AI-Powered Video Generation
      </p>
    </AbsoluteFill>
  );
};

// Scene 2: Feature showcase with staggered cards and different easings
const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Each card uses a DIFFERENT easing for variety
  const features = [
    { icon: "⚡", title: "Lightning Fast", color: "#f59e0b", easing: Easing.out(Easing.exp) },
    { icon: "🎨", title: "Beautiful Design", color: "#ec4899", easing: Easing.out(Easing.back(1.5)) },
    { icon: "🚀", title: "Easy to Use", color: "#8b5cf6", easing: Easing.out(Easing.circle) },
  ];

  // Title with ease-out quad
  const titleProgress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontSize: Math.round(width * 0.045),
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          marginBottom: 60,
          opacity: titleProgress,
          transform: \`translateY(\${interpolate(titleProgress, [0, 1], [-30, 0])}px)\`,
        }}
      >
        Why Choose Us?
      </h2>

      {/* Feature cards - each with different easing */}
      <div style={{ display: "flex", gap: 40 }}>
        {features.map((feature, i) => {
          const delay = i * 12 + 15;

          // Using interpolate with custom easing instead of spring
          const cardProgress = interpolate(
            frame - delay,
            [0, 30],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: feature.easing,
            }
          );

          const cardY = interpolate(cardProgress, [0, 1], [80, 0]);
          const cardOpacity = cardProgress;
          const cardScale = interpolate(cardProgress, [0, 1], [0.7, 1]);

          // Subtle floating animation with easing
          const floatOffset = interpolate(
            (frame + i * 20) % 60,
            [0, 30, 60],
            [0, -8, 0],
            { easing: Easing.inOut(Easing.sin) }
          );

          return (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 24,
                padding: 40,
                width: Math.round(width * 0.22),
                textAlign: "center",
                opacity: cardOpacity,
                transform: \`translateY(\${cardY + floatOffset}px) scale(\${cardScale})\`,
                border: \`2px solid \${feature.color}30\`,
                boxShadow: \`0 20px 40px rgba(0, 0, 0, 0.3), 0 0 60px \${feature.color}20\`,
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 20 }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: Math.round(width * 0.022),
                  fontWeight: 700,
                  color: feature.color,
                  fontFamily: "Inter, sans-serif",
                  margin: 0,
                }}
              >
                {feature.title}
              </h3>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Dynamic text with typewriter + highlight
const TypewriterScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const TEXT = "Create stunning videos with AI";
  const HIGHLIGHT_WORD = "AI";
  const CHAR_FRAMES = 2;

  // Typewriter effect
  const typedChars = Math.min(TEXT.length, Math.floor(frame / CHAR_FRAMES));
  const typedText = TEXT.slice(0, typedChars);
  const typingDone = typedChars >= TEXT.length;

  // Cursor blink
  const cursorOpacity = !typingDone
    ? interpolate(frame % 16, [0, 8, 16], [1, 0, 1])
    : 0;

  // Highlight animation (starts after typing)
  const highlightStart = TEXT.length * CHAR_FRAMES + 10;
  const highlightProgress = spring({
    frame: frame - highlightStart,
    fps,
    config: { damping: 15, stiffness: 150 },
  });
  const highlightScale = interpolate(highlightProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Split text for highlight rendering
  const highlightIndex = TEXT.indexOf(HIGHLIGHT_WORD);
  const preText = TEXT.slice(0, highlightIndex);
  const postText = TEXT.slice(highlightIndex + HIGHLIGHT_WORD.length);

  // Container entrance
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: interpolate(entranceSpring, [0, 1], [0, 1]),
          transform: \`translateX(\${interpolate(entranceSpring, [0, 1], [40, 0])}px)\`,
        }}
      >
        {/* Typewriter layer */}
        <div
          style={{
            fontSize: Math.round(width * 0.055),
            fontWeight: 800,
            color: "#1a1a2e",
            fontFamily: "Inter, sans-serif",
            position: "relative",
          }}
        >
          {!typingDone ? (
            <>
              <span>{typedText}</span>
              <span style={{ opacity: cursorOpacity }}>▌</span>
            </>
          ) : (
            <>
              <span>{preText}</span>
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "-0.1em",
                    right: "-0.1em",
                    top: "50%",
                    height: "1.1em",
                    transform: \`translateY(-50%) scaleX(\${highlightScale})\`,
                    transformOrigin: "left center",
                    background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                    borderRadius: "0.15em",
                    zIndex: 0,
                  }}
                />
                <span style={{ position: "relative", zIndex: 1, color: "#ffffff" }}>
                  {HIGHLIGHT_WORD}
                </span>
              </span>
              <span>{postText}</span>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Call to action with pulsing button
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Text entrance
  const textSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Button entrance with bounce
  const buttonSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // Button pulse
  const pulse = 1 + Math.sin(frame / 10) * 0.05;

  // Radial lines animation
  const lines = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const lineProgress = interpolate(
      frame,
      [0, 60],
      [0, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
    );
    return {
      angle,
      length: lineProgress * 200 + 100,
      opacity: interpolate(frame, [50, 90], [0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    };
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Radial lines */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        {lines.map((line, i) => (
          <line
            key={i}
            x1="50%"
            y1="50%"
            x2={\`\${50 + Math.cos(line.angle) * 30}%\`}
            y2={\`\${50 + Math.sin(line.angle) * 30}%\`}
            stroke="#8b5cf6"
            strokeWidth="2"
            opacity={line.opacity}
          />
        ))}
      </svg>

      {/* Main text */}
      <h2
        style={{
          fontSize: Math.round(width * 0.05),
          fontWeight: 900,
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          margin: 0,
          marginBottom: 40,
          opacity: interpolate(textSpring, [0, 1], [0, 1]),
          transform: \`translateY(\${interpolate(textSpring, [0, 1], [40, 0])}px)\`,
        }}
      >
        Ready to Create?
      </h2>

      {/* CTA Button */}
      <div
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
          padding: "20px 60px",
          borderRadius: 50,
          opacity: interpolate(buttonSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp" }),
          transform: \`scale(\${interpolate(buttonSpring, [0, 1], [0.5, 1], { extrapolateLeft: "clamp" }) * pulse})\`,
          boxShadow: "0 10px 40px rgba(139, 92, 246, 0.5)",
        }}
      >
        <span
          style={{
            fontSize: Math.round(width * 0.025),
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Get Started
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const MyAnimation = () => {
  const { fps } = useVideoConfig();

  const SCENE_DURATION = 3 * fps; // 3 seconds per scene

  return (
    <AbsoluteFill>
      {/* Scene 1: Intro */}
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Features */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <FeaturesScene />
      </Sequence>

      {/* Scene 3: Typewriter */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <TypewriterScene />
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};`;

export const multiSceneShowcaseExample: RemotionExample = {
  id: "multi-scene-showcase",
  name: "Multi-Scene Showcase",
  description: "4-scene animation with dynamic text, typewriter effect, spring animations, and custom transitions",
  category: "Showcase",
  durationInFrames: 360, // 12 seconds at 30fps
  fps: 30,
  code: multiSceneShowcaseCode,
};
