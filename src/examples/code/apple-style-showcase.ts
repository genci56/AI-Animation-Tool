import { RemotionExample } from "./index";

export const appleStyleShowcaseCode = `import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";

// ============== CINEMATIC CONSTANTS ==============
const APPLE_BLACK = "#000000";
const APPLE_WHITE = "#FFFFFF";
const APPLE_GRAY = "#86868b";
const APPLE_BLUE = "#0071e3";
const APPLE_GOLD = "#f5d0a9";
const APPLE_PURPLE = "#bf5af2";

// Premium easing for Apple-like smoothness
const CINEMATIC_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
const DRAMATIC_EASING = Easing.bezier(0.16, 1, 0.3, 1);

// ============== SCENE 1: Dramatic Word Reveal ==============
const DramaticWordScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Black screen, then dramatic word fade
  const wordOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CINEMATIC_EASING,
  });

  const wordScale = interpolate(frame, [20, 50], [1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DRAMATIC_EASING,
  });

  // Subtle light sweep
  const lightX = interpolate(frame, [0, 90], [-width * 0.5, width * 1.5]);

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Subtle light sweep */}
      <div style={{
        position: "absolute",
        left: lightX,
        top: 0,
        width: 200,
        height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
        transform: "skewX(-20deg)",
      }} />

      <h1 style={{
        fontSize: Math.round(width * 0.15),
        fontWeight: 600,
        color: APPLE_WHITE,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        letterSpacing: -8,
        opacity: wordOpacity,
        transform: \`scale(\${wordScale})\`,
      }}>
        Imagine.
      </h1>
    </AbsoluteFill>
  );
};

// ============== SCENE 2: Product Reveal with Spotlight ==============
const ProductRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Product rises from below with rotation
  const revealProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DRAMATIC_EASING,
  });

  const productY = interpolate(revealProgress, [0, 1], [200, 0]);
  const productRotateY = interpolate(revealProgress, [0, 1], [-30, 0]);
  const productOpacity = interpolate(revealProgress, [0, 0.3, 1], [0, 1, 1]);

  // Continuous subtle rotation after reveal
  const floatRotation = frame > 60 ? interpolate(frame - 60, [0, 120], [0, 8]) : 0;

  // Spotlight effect
  const spotlightSize = interpolate(frame, [0, 40], [0, 600], { extrapolateRight: "clamp", easing: CINEMATIC_EASING });

  // Ambient particles
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 250 + Math.sin(frame / 30 + i) * 50;
    const x = Math.cos(angle + frame / 200) * radius;
    const y = Math.sin(angle + frame / 200) * radius * 0.3;
    const particleOpacity = interpolate(frame, [20, 50], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, y, opacity: particleOpacity * (0.3 + Math.sin(frame / 20 + i) * 0.2) };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", alignItems: "center", justifyContent: "center", perspective: 1500 }}>
      {/* Radial spotlight */}
      <div style={{
        position: "absolute",
        width: spotlightSize,
        height: spotlightSize,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
      }} />

      {/* Ambient particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: width / 2 + p.x,
          top: height / 2 + p.y,
          width: 3,
          height: 3,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.5)",
          opacity: p.opacity,
        }} />
      ))}

      {/* Product (represented as sleek device) */}
      <div style={{
        opacity: productOpacity,
        transform: \`translateY(\${productY}px) rotateY(\${productRotateY + floatRotation}deg)\`,
        transformStyle: "preserve-3d",
      }}>
        {/* Device body */}
        <div style={{
          width: Math.round(width * 0.25),
          height: Math.round(width * 0.5),
          background: "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 50%, #0a0a0e 100%)",
          borderRadius: 40,
          boxShadow: "0 50px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          {/* Screen */}
          <div style={{
            width: "92%",
            height: "95%",
            background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1f 100%)",
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Screen content - subtle gradient animation */}
            <div style={{
              width: "80%",
              height: "60%",
              background: \`linear-gradient(\${45 + frame}deg, \${APPLE_PURPLE}40, \${APPLE_BLUE}40, \${APPLE_PURPLE}40)\`,
              borderRadius: 20,
              opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }} />
          </div>
          {/* Notch */}
          <div style={{
            position: "absolute",
            top: 15,
            width: 100,
            height: 30,
            background: "#000",
            borderRadius: 20,
          }} />
        </div>
      </div>

      {/* Product name */}
      <div style={{
        position: "absolute",
        bottom: 100,
        opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: \`translateY(\${interpolate(frame, [50, 70], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)\`,
      }}>
        <h2 style={{
          fontSize: Math.round(width * 0.04),
          fontWeight: 600,
          color: APPLE_WHITE,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          letterSpacing: -1,
        }}>
          iPhone Pro Max
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 3: Bold Feature Statement ==============
const FeatureStatementScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const line1Progress = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: DRAMATIC_EASING });
  const line2Progress = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: DRAMATIC_EASING });
  const highlightProgress = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <h2 style={{
        fontSize: Math.round(width * 0.055),
        fontWeight: 600,
        color: APPLE_GRAY,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        letterSpacing: -2,
        opacity: line1Progress,
        transform: \`translateY(\${interpolate(line1Progress, [0, 1], [30, 0])}px)\`,
      }}>
        The most powerful chip
      </h2>

      <h1 style={{
        fontSize: Math.round(width * 0.08),
        fontWeight: 700,
        color: APPLE_WHITE,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        letterSpacing: -3,
        opacity: line2Progress,
        transform: \`translateY(\${interpolate(line2Progress, [0, 1], [30, 0])}px)\`,
        position: "relative",
      }}>
        ever in a smartphone.
        {/* Animated underline */}
        <div style={{
          position: "absolute",
          bottom: -10,
          left: 0,
          height: 4,
          width: \`\${highlightProgress * 100}%\`,
          background: \`linear-gradient(90deg, \${APPLE_BLUE}, \${APPLE_PURPLE})\`,
          borderRadius: 2,
        }} />
      </h1>
    </AbsoluteFill>
  );
};

// ============== SCENE 4: Cinematic Numbers ==============
const CinematicNumbersScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const specs = [
    { value: 6, suffix: "x", label: "Faster GPU", delay: 0 },
    { value: 22, suffix: "hrs", label: "Battery Life", delay: 10 },
    { value: 48, suffix: "MP", label: "Pro Camera", delay: 20 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: Math.round(width * 0.1) }}>
        {specs.map((spec, i) => {
          const progress = interpolate(frame - spec.delay, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: DRAMATIC_EASING });
          const countProgress = interpolate(frame - spec.delay - 10, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
          const currentValue = Math.round(spec.value * countProgress);

          return (
            <div key={i} style={{
              textAlign: "center",
              opacity: progress,
              transform: \`translateY(\${interpolate(progress, [0, 1], [40, 0])}px)\`,
            }}>
              <div style={{
                fontSize: Math.round(width * 0.1),
                fontWeight: 700,
                background: \`linear-gradient(180deg, \${APPLE_WHITE} 0%, \${APPLE_GRAY} 100%)\`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                letterSpacing: -4,
                lineHeight: 1,
              }}>
                {currentValue}{spec.suffix}
              </div>
              <div style={{
                fontSize: Math.round(width * 0.018),
                color: APPLE_GRAY,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                marginTop: 15,
                letterSpacing: 0.5,
              }}>
                {spec.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 5: Split Screen Feature ==============
const SplitScreenScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const splitProgress = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: DRAMATIC_EASING });
  const textProgress = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, overflow: "hidden" }}>
      {/* Left side - Image/Visual */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "50%",
        height: "100%",
        background: "linear-gradient(135deg, #1a1a2e 0%, #0a0a1e 100%)",
        transform: \`translateX(\${interpolate(splitProgress, [0, 1], [-width * 0.5, 0])}px)\`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Camera lens representation */}
        <div style={{
          width: Math.round(width * 0.2),
          height: Math.round(width * 0.2),
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #3a3a4e, #1a1a2e, #0a0a1e)",
          boxShadow: "0 0 0 20px rgba(255,255,255,0.05), 0 0 0 40px rgba(255,255,255,0.02), inset 0 0 60px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, #2a2a4e, #0a0a2e)",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: \`conic-gradient(from \${frame * 2}deg, transparent 0deg, rgba(100,100,255,0.3) 60deg, transparent 120deg)\`,
            }} />
          </div>
        </div>
      </div>

      {/* Right side - Text */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "50%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: Math.round(width * 0.06),
        transform: \`translateX(\${interpolate(splitProgress, [0, 1], [width * 0.5, 0])}px)\`,
      }}>
        <h3 style={{
          fontSize: Math.round(width * 0.02),
          fontWeight: 500,
          color: APPLE_BLUE,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          marginBottom: 15,
          opacity: textProgress,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}>
          Pro Camera System
        </h3>
        <h2 style={{
          fontSize: Math.round(width * 0.045),
          fontWeight: 600,
          color: APPLE_WHITE,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          letterSpacing: -1,
          lineHeight: 1.2,
          opacity: textProgress,
          transform: \`translateY(\${interpolate(textProgress, [0, 1], [20, 0])}px)\`,
        }}>
          Capture light like<br />never before.
        </h2>
        <p style={{
          fontSize: Math.round(width * 0.016),
          color: APPLE_GRAY,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          marginTop: 25,
          lineHeight: 1.6,
          opacity: interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          The new 48MP main camera features a quad-pixel sensor for incredible detail in every shot.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 6: Comparison Visualization ==============
const ComparisonScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const revealProgress = interpolate(frame, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: DRAMATIC_EASING });
  const barProgress = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });

  const comparisons = [
    { label: "Performance", old: 60, new: 100 },
    { label: "Efficiency", old: 50, new: 95 },
    { label: "Neural Engine", old: 40, new: 100 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: Math.round(width * 0.1) }}>
      <h2 style={{
        fontSize: Math.round(width * 0.04),
        fontWeight: 600,
        color: APPLE_WHITE,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        marginBottom: 60,
        opacity: revealProgress,
        letterSpacing: -1,
      }}>
        A17 Pro vs Competition
      </h2>

      <div style={{ width: "100%", maxWidth: Math.round(width * 0.6), display: "flex", flexDirection: "column", gap: 40 }}>
        {comparisons.map((item, i) => {
          const itemDelay = i * 10;
          const itemProgress = interpolate(frame - itemDelay, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });

          return (
            <div key={i} style={{ opacity: interpolate(frame - itemDelay, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <div style={{
                fontSize: Math.round(width * 0.016),
                color: APPLE_GRAY,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                marginBottom: 12,
              }}>
                {item.label}
              </div>
              {/* Competition bar */}
              <div style={{
                height: 8,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 4,
                marginBottom: 8,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: \`\${item.old * itemProgress}%\`,
                  background: APPLE_GRAY,
                  borderRadius: 4,
                }} />
              </div>
              {/* A17 Pro bar */}
              <div style={{
                height: 12,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 6,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: \`\${item.new * itemProgress}%\`,
                  background: \`linear-gradient(90deg, \${APPLE_BLUE}, \${APPLE_PURPLE})\`,
                  borderRadius: 6,
                  boxShadow: \`0 0 20px \${APPLE_BLUE}50\`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        gap: 40,
        marginTop: 50,
        opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 12, height: 12, background: APPLE_GRAY, borderRadius: 3 }} />
          <span style={{ fontSize: Math.round(width * 0.014), color: APPLE_GRAY, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>Competition</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 12, height: 12, background: \`linear-gradient(90deg, \${APPLE_BLUE}, \${APPLE_PURPLE})\`, borderRadius: 3 }} />
          <span style={{ fontSize: Math.round(width * 0.014), color: APPLE_WHITE, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>A17 Pro</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 7: Floating Features with Parallax ==============
const FloatingFeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const features = [
    { icon: "●", label: "Titanium Design", x: -0.25, y: -0.15, delay: 0 },
    { icon: "◆", label: "Action Button", x: 0.25, y: -0.2, delay: 8 },
    { icon: "▲", label: "USB-C", x: -0.3, y: 0.2, delay: 16 },
    { icon: "■", label: "5G Ultra", x: 0.3, y: 0.15, delay: 24 },
  ];

  // Central element subtle float
  const centerFloat = Math.sin(frame / 20) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Central glowing orb */}
      <div style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: \`radial-gradient(circle, \${APPLE_PURPLE}30 0%, transparent 70%)\`,
        transform: \`translateY(\${centerFloat}px)\`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: \`linear-gradient(135deg, \${APPLE_BLUE}, \${APPLE_PURPLE})\`,
          boxShadow: \`0 0 60px \${APPLE_PURPLE}60\`,
        }} />
      </div>

      {/* Floating feature labels */}
      {features.map((f, i) => {
        const progress = interpolate(frame - f.delay, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: DRAMATIC_EASING });
        const floatY = Math.sin((frame + i * 30) / 25) * 8;
        const x = width / 2 + f.x * width;
        const y = height / 2 + f.y * height + floatY;

        return (
          <div key={i} style={{
            position: "absolute",
            left: x,
            top: y,
            transform: "translate(-50%, -50%)",
            opacity: progress,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: APPLE_WHITE,
            }}>
              {f.icon}
            </div>
            <span style={{
              fontSize: Math.round(width * 0.018),
              color: APPLE_WHITE,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              fontWeight: 500,
            }}>
              {f.label}
            </span>
          </div>
        );
      })}

      {/* Connection lines */}
      <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
        {features.map((f, i) => {
          const lineProgress = interpolate(frame - f.delay - 20, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = width / 2 + f.x * width;
          const y = height / 2 + f.y * height;
          return (
            <line
              key={i}
              x1={width / 2}
              y1={height / 2}
              x2={width / 2 + (x - width / 2) * lineProgress}
              y2={height / 2 + (y - height / 2) * lineProgress}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============== SCENE 8: Minimal Quote ==============
const MinimalQuoteScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const quoteProgress = interpolate(frame, [10, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });
  const authorProgress = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: Math.round(width * 0.15) }}>
      <p style={{
        fontSize: Math.round(width * 0.035),
        fontWeight: 500,
        color: APPLE_WHITE,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        textAlign: "center",
        lineHeight: 1.5,
        letterSpacing: -0.5,
        opacity: quoteProgress,
        transform: \`translateY(\${interpolate(quoteProgress, [0, 1], [30, 0])}px)\`,
      }}>
        "The best iPhone we've ever made.<br />By a long shot."
      </p>

      <div style={{
        marginTop: 50,
        opacity: authorProgress,
        transform: \`translateY(\${interpolate(authorProgress, [0, 1], [20, 0])}px)\`,
        display: "flex",
        alignItems: "center",
        gap: 15,
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3a3a3e, #2a2a2e)",
        }} />
        <div>
          <div style={{ fontSize: Math.round(width * 0.016), color: APPLE_WHITE, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", fontWeight: 500 }}>
            Tim Cook
          </div>
          <div style={{ fontSize: Math.round(width * 0.012), color: APPLE_GRAY, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
            CEO, Apple
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 9: Color Options Gallery ==============
const ColorGalleryScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const colors = [
    { name: "Natural Titanium", color: "#a8a8a8" },
    { name: "Blue Titanium", color: "#4a5568" },
    { name: "White Titanium", color: "#e8e8e8" },
    { name: "Black Titanium", color: "#2a2a2a" },
  ];

  const titleProgress = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{
        fontSize: Math.round(width * 0.035),
        fontWeight: 600,
        color: APPLE_WHITE,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        marginBottom: 60,
        opacity: titleProgress,
        letterSpacing: -1,
      }}>
        Four stunning finishes.
      </h2>

      <div style={{ display: "flex", gap: 50 }}>
        {colors.map((c, i) => {
          const delay = i * 12 + 20;
          const progress = interpolate(frame - delay, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: DRAMATIC_EASING });
          const isActive = Math.floor((frame - 40) / 25) % 4 === i;
          const activeScale = isActive ? 1.1 : 1;

          return (
            <div key={i} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              opacity: progress,
              transform: \`translateY(\${interpolate(progress, [0, 1], [30, 0])}px) scale(\${activeScale})\`,
              transition: "transform 0.3s ease",
            }}>
              {/* Mini device */}
              <div style={{
                width: Math.round(width * 0.06),
                height: Math.round(width * 0.12),
                background: \`linear-gradient(135deg, \${c.color} 0%, \${c.color}cc 100%)\`,
                borderRadius: 12,
                boxShadow: isActive ? \`0 20px 40px rgba(0,0,0,0.5), 0 0 30px \${c.color}40\` : "0 10px 30px rgba(0,0,0,0.3)",
              }}>
                <div style={{
                  margin: "8%",
                  height: "84%",
                  background: "#1a1a1a",
                  borderRadius: 8,
                }} />
              </div>
              <span style={{
                fontSize: Math.round(width * 0.012),
                color: isActive ? APPLE_WHITE : APPLE_GRAY,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}>
                {c.name}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 10: Final CTA with Logo ==============
const FinalCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoProgress = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });
  const taglineProgress = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });
  const dateProgress = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CINEMATIC_EASING });

  // Subtle breathing glow
  const glowIntensity = 0.3 + Math.sin(frame / 15) * 0.1;

  return (
    <AbsoluteFill style={{ backgroundColor: APPLE_BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Apple logo (represented) */}
      <div style={{
        width: 80,
        height: 80,
        opacity: logoProgress,
        transform: \`scale(\${interpolate(logoProgress, [0, 1], [0.5, 1])})\`,
        marginBottom: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <svg viewBox="0 0 24 24" width="80" height="80" fill={APPLE_WHITE}>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      </div>

      {/* Product name */}
      <h1 style={{
        fontSize: Math.round(width * 0.05),
        fontWeight: 600,
        color: APPLE_WHITE,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        letterSpacing: -2,
        opacity: logoProgress,
        marginBottom: 15,
      }}>
        iPhone 15 Pro
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: Math.round(width * 0.025),
        color: APPLE_GRAY,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        opacity: taglineProgress,
        transform: \`translateY(\${interpolate(taglineProgress, [0, 1], [20, 0])}px)\`,
      }}>
        Titanium. So strong. So light. So Pro.
      </p>

      {/* Date/CTA */}
      <div style={{
        marginTop: 60,
        opacity: dateProgress,
        transform: \`translateY(\${interpolate(dateProgress, [0, 1], [20, 0])}px)\`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 15,
      }}>
        <div style={{
          padding: "15px 40px",
          background: APPLE_BLUE,
          borderRadius: 30,
          boxShadow: \`0 0 30px \${APPLE_BLUE}\${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}\`,
        }}>
          <span style={{
            fontSize: Math.round(width * 0.016),
            fontWeight: 500,
            color: APPLE_WHITE,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          }}>
            Pre-order now
          </span>
        </div>
        <span style={{
          fontSize: Math.round(width * 0.014),
          color: APPLE_GRAY,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        }}>
          Available September 22
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============== MAIN COMPOSITION ==============
export const MyAnimation = () => {
  const { fps } = useVideoConfig();
  const SCENE_DURATION = 3 * fps; // 3 seconds per scene

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}><DramaticWordScene /></Sequence>
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}><ProductRevealScene /></Sequence>
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} premountFor={fps}><FeatureStatementScene /></Sequence>
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION} premountFor={fps}><CinematicNumbersScene /></Sequence>
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION} premountFor={fps}><SplitScreenScene /></Sequence>
      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION} premountFor={fps}><ComparisonScene /></Sequence>
      <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION} premountFor={fps}><FloatingFeaturesScene /></Sequence>
      <Sequence from={SCENE_DURATION * 7} durationInFrames={SCENE_DURATION} premountFor={fps}><MinimalQuoteScene /></Sequence>
      <Sequence from={SCENE_DURATION * 8} durationInFrames={SCENE_DURATION} premountFor={fps}><ColorGalleryScene /></Sequence>
      <Sequence from={SCENE_DURATION * 9} durationInFrames={SCENE_DURATION} premountFor={fps}><FinalCTAScene /></Sequence>
    </AbsoluteFill>
  );
};`;

export const appleStyleShowcaseExample: RemotionExample = {
  id: "apple-style-showcase",
  name: "Apple-Style Product Launch",
  description: "Hollywood-level 10-scene marketing video with cinematic reveals, dramatic typography, product showcase, and premium animations",
  category: "Showcase",
  durationInFrames: 900, // 30 seconds at 30fps (10 scenes x 3 seconds)
  fps: 30,
  code: appleStyleShowcaseCode,
};
