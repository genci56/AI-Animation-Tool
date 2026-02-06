import { RemotionExample } from './index';

export const creatorLoopShowcase: RemotionExample = {
  id: 'creator-loop-showcase',
  name: "The Creator's Loop",
  description: 'A high-end 10-scene motion graphics video about the modern content creation workflow with sleek dark-themed aesthetics.',
  durationInFrames: 900,
  fps: 30,
  category: 'Showcase',
  code: `// ============================================
// THE CREATOR'S LOOP - 10 Scene Motion Graphics
// ============================================

// Design tokens
const COLORS = {
  black: '#000000',
  zinc900: '#18181b',
  zinc800: '#27272a',
  zinc700: '#3f3f46',
  zinc600: '#52525b',
  zinc400: '#a1a1aa',
  zinc300: '#d4d4d8',
  white: '#ffffff',
  electricBlue: '#3b82f6',
  electricBlueBright: '#60a5fa',
  cyberPurple: '#a855f7',
  cyberPurpleBright: '#c084fc',
};

const SCENE_DURATION = 90; // 3 seconds at 30fps

// ============================================
// ANIMATED BACKGROUND COMPONENT
// ============================================
const AnimatedBackground = ({ children, frame }) => {
  const gradientX = interpolate(frame % 300, [0, 150, 300], [0, 20, 0]);
  const gradientY = interpolate(frame % 400, [0, 200, 400], [0, 15, 0]);

  return (
    <AbsoluteFill style={{
      background: \`radial-gradient(ellipse at \${50 + gradientX}% \${50 + gradientY}%, \${COLORS.zinc900} 0%, \${COLORS.black} 70%)\`,
      overflow: 'hidden',
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: \`
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        \`,
        backgroundSize: '60px 60px',
        opacity: 0.5,
      }} />
      {/* Glow orbs */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: \`radial-gradient(circle, \${COLORS.electricBlue}15 0%, transparent 70%)\`,
        left: \`\${30 + Math.sin(frame * 0.01) * 10}%\`,
        top: \`\${20 + Math.cos(frame * 0.008) * 10}%\`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: \`radial-gradient(circle, \${COLORS.cyberPurple}12 0%, transparent 70%)\`,
        right: \`\${20 + Math.cos(frame * 0.012) * 8}%\`,
        bottom: \`\${25 + Math.sin(frame * 0.009) * 8}%\`,
        transform: 'translate(50%, 50%)',
        filter: 'blur(60px)',
      }} />
      {children}
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 1: TITLE WITH GLOWING PULSE
// ============================================
const Scene1Title = ({ frame, fps }) => {
  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100, mass: 0.8 } });
  const subtitleSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 80 } });
  const pulseIntensity = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 1]);
  const glowSize = interpolate(Math.sin(frame * 0.15), [-1, 1], [20, 40]);

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{
          position: 'relative',
          transform: \`translateY(\${interpolate(titleSpring, [0, 1], [60, 0])}px)\`,
          opacity: titleSpring,
        }}>
          <h1 style={{
            position: 'absolute',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: \`linear-gradient(135deg, \${COLORS.electricBlue}, \${COLORS.cyberPurple})\`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: \`blur(\${glowSize}px)\`,
            opacity: pulseIntensity * 0.6,
            margin: 0,
          }}>
            The Creator's Loop
          </h1>
          <h1 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: \`linear-gradient(135deg, \${COLORS.electricBlue}, \${COLORS.cyberPurple})\`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>
            The Creator's Loop
          </h1>
        </div>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.zinc400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: 30,
          transform: \`translateY(\${interpolate(Math.max(0, subtitleSpring), [0, 1], [30, 0])}px)\`,
          opacity: Math.max(0, subtitleSpring),
        }}>
          The Modern Content Workflow
        </p>
        <div style={{
          width: interpolate(titleSpring, [0, 1], [0, 200]),
          height: 2,
          background: \`linear-gradient(90deg, transparent, \${COLORS.electricBlue}, \${COLORS.cyberPurple}, transparent)\`,
          marginTop: 40,
          opacity: pulseIntensity,
        }} />
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 2: IDEATION - FLOATING NODES
// ============================================
const Scene2Ideation = ({ frame, fps }) => {
  const nodes = [
    { icon: '💡', angle: 0, delay: 0 },
    { icon: '🎯', angle: 60, delay: 5 },
    { icon: '📝', angle: 120, delay: 10 },
    { icon: '🔍', angle: 180, delay: 15 },
    { icon: '💬', angle: 240, delay: 20 },
    { icon: '⚡', angle: 300, delay: 25 },
  ];

  const brainSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 80 } });

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 120,
          opacity: Math.max(0, titleSpring),
          transform: \`translateY(\${interpolate(Math.max(0, titleSpring), [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Ideation
          </h2>
        </div>

        <div style={{
          position: 'relative',
          width: 140,
          height: 140,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: \`scale(\${brainSpring})\`,
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: \`radial-gradient(circle, \${COLORS.cyberPurple}40 0%, transparent 70%)\`,
            filter: 'blur(20px)',
          }} />
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: \`linear-gradient(135deg, \${COLORS.zinc800}, \${COLORS.zinc900})\`,
            border: \`2px solid \${COLORS.cyberPurple}50\`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: \`0 0 40px \${COLORS.cyberPurple}30\`,
            fontSize: 56,
          }}>
            🧠
          </div>
        </div>

        {nodes.map((node, i) => {
          const nodeSpring = spring({ frame: frame - node.delay, fps, config: { damping: 12, stiffness: 60, mass: 1.2 } });
          const floatOffset = Math.sin((frame + i * 20) * 0.05) * 8;
          const radius = 220;
          const angleRad = (node.angle + frame * 0.3) * (Math.PI / 180);
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <div key={i} style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: \`translate(calc(-50% + \${x * nodeSpring}px), calc(-50% + \${(y + floatOffset) * nodeSpring}px)) scale(\${nodeSpring})\`,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: \`linear-gradient(135deg, \${COLORS.zinc800}, \${COLORS.zinc900})\`,
              border: \`1px solid \${COLORS.zinc700}\`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 28,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}>
              {node.icon}
            </div>
          );
        })}
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 3: SCRIPTING - TEXT EDITOR UI
// ============================================
const Scene3Scripting = ({ frame, fps }) => {
  const editorSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  const lines = [
    { text: '// The Creator\\'s Journey', color: COLORS.zinc600, delay: 10 },
    { text: '', color: COLORS.zinc600, delay: 15 },
    { text: 'const workflow = {', color: COLORS.cyberPurple, delay: 20 },
    { text: '  ideate: () => generateIdeas(),', color: COLORS.electricBlueBright, delay: 28 },
    { text: '  create: () => produceContent(),', color: COLORS.electricBlueBright, delay: 36 },
    { text: '  publish: () => shareWithWorld(),', color: COLORS.electricBlueBright, delay: 44 },
    { text: '  analyze: () => measureImpact(),', color: COLORS.electricBlueBright, delay: 52 },
    { text: '};', color: COLORS.cyberPurple, delay: 60 },
  ];

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
        <div style={{
          position: 'absolute',
          top: 100,
          opacity: editorSpring,
          transform: \`translateY(\${interpolate(editorSpring, [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            📝 Scripting
          </h2>
        </div>

        <div style={{
          width: 900,
          background: \`linear-gradient(180deg, \${COLORS.zinc900} 0%, \${COLORS.black} 100%)\`,
          borderRadius: 16,
          border: \`1px solid \${COLORS.zinc800}\`,
          overflow: 'hidden',
          transform: \`scale(\${editorSpring}) translateY(\${interpolate(editorSpring, [0, 1], [40, 0])}px)\`,
          boxShadow: \`0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px \${COLORS.zinc800}\`,
          marginTop: 60,
        }}>
          <div style={{
            height: 48,
            background: COLORS.zinc900,
            borderBottom: \`1px solid \${COLORS.zinc800}\`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 13, color: COLORS.zinc600 }}>
              workflow.ts
            </span>
          </div>

          <div style={{ padding: '24px 32px', fontFamily: "'JetBrains Mono', monospace", fontSize: 18, lineHeight: 1.8 }}>
            {lines.map((line, i) => {
              const lineProgress = interpolate(frame - line.delay, [0, 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
              const charCount = Math.floor(line.text.length * lineProgress);
              const displayText = line.text.slice(0, charCount);
              const showCursor = frame >= line.delay && frame < line.delay + 12 && i === lines.findIndex(l => frame >= l.delay && frame < l.delay + 12);

              return (
                <div key={i} style={{ opacity: frame >= line.delay ? 1 : 0, display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: 40, color: COLORS.zinc700, fontSize: 14 }}>{i + 1}</span>
                  <span style={{ color: line.color }}>{displayText}</span>
                  {showCursor && (
                    <span style={{
                      width: 2,
                      height: 20,
                      background: COLORS.electricBlue,
                      marginLeft: 2,
                      opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 4: VISUAL DESIGN - 3D LAYERS
// ============================================
const Scene4VisualDesign = ({ frame, fps }) => {
  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  const layers = [
    { color: COLORS.cyberPurple, label: 'Effects', delay: 15 },
    { color: COLORS.electricBlue, label: 'Graphics', delay: 25 },
    { color: '#10b981', label: 'Text', delay: 35 },
    { color: '#f59e0b', label: 'Media', delay: 45 },
    { color: COLORS.zinc700, label: 'Background', delay: 55 },
  ];

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 100,
          opacity: titleSpring,
          transform: \`translateY(\${interpolate(titleSpring, [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            🎨 Visual Design
          </h2>
        </div>

        <div style={{ perspective: 1000, perspectiveOrigin: 'center center', marginTop: 40 }}>
          <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateZ(-35deg)' }}>
            {layers.map((layer, i) => {
              const layerSpring = spring({ frame: frame - layer.delay, fps, config: { damping: 14, stiffness: 60, mass: 1 } });
              const yOffset = i * 45;
              const floatY = Math.sin((frame + i * 10) * 0.04) * 3;

              return (
                <div key={i} style={{
                  width: 400,
                  height: 250,
                  background: \`linear-gradient(135deg, \${layer.color}30, \${layer.color}10)\`,
                  border: \`1px solid \${layer.color}60\`,
                  borderRadius: 12,
                  position: 'absolute',
                  transform: \`translateZ(\${yOffset * layerSpring}px) translateY(\${floatY}px)\`,
                  opacity: layerSpring,
                  boxShadow: \`0 20px 40px rgba(0,0,0,0.4)\`,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 20,
                }}>
                  <span style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: layer.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {layer.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 5: PRODUCTION - RECORDING INDICATOR
// ============================================
const Scene5Production = ({ frame, fps }) => {
  const containerSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const pulseScale = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.8, 1.2]);
  const waveformBars = 32;

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 100,
          opacity: containerSpring,
          transform: \`translateY(\${interpolate(containerSpring, [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            🎙️ Production
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, transform: \`scale(\${containerSpring})\`, marginTop: 60 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 32px',
            background: COLORS.zinc900,
            borderRadius: 100,
            border: \`1px solid \${COLORS.zinc800}\`,
          }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#ef4444',
              transform: \`scale(\${pulseScale})\`,
              boxShadow: '0 0 20px #ef444480',
            }} />
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: COLORS.white,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Recording
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 18, color: COLORS.zinc400 }}>
              {String(Math.floor(frame / 30)).padStart(2, '0')}:{String(frame % 30).padStart(2, '0')}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            height: 120,
            padding: '0 40px',
            background: \`linear-gradient(180deg, \${COLORS.zinc900} 0%, \${COLORS.black} 100%)\`,
            borderRadius: 16,
            border: \`1px solid \${COLORS.zinc800}\`,
          }}>
            {Array.from({ length: waveformBars }).map((_, i) => {
              const barSpring = spring({ frame: frame - i * 0.5, fps, config: { damping: 8, stiffness: 100 } });
              const noise = Math.sin(frame * 0.15 + i * 0.5) * 0.5 + 0.5;
              const height = interpolate(noise, [0, 1], [20, 80]) * barSpring;

              return (
                <div key={i} style={{
                  width: 6,
                  height,
                  borderRadius: 3,
                  background: \`linear-gradient(180deg, \${COLORS.electricBlue}, \${COLORS.cyberPurple})\`,
                  opacity: 0.4 + (i < waveformBars / 2 ? i / (waveformBars / 2) : (waveformBars - i) / (waveformBars / 2)) * 0.6,
                }} />
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 6: POST-PROCESSING - COLOR SLIDERS
// ============================================
const Scene6PostProcessing = ({ frame, fps }) => {
  const containerSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  const sliders = [
    { label: 'Exposure', value: 65, color: COLORS.white, delay: 10 },
    { label: 'Contrast', value: 45, color: COLORS.zinc300, delay: 18 },
    { label: 'Highlights', value: 30, color: '#fbbf24', delay: 26 },
    { label: 'Shadows', value: 55, color: COLORS.zinc600, delay: 34 },
    { label: 'Saturation', value: 70, color: COLORS.cyberPurple, delay: 42 },
    { label: 'Vibrance', value: 80, color: COLORS.electricBlue, delay: 50 },
  ];

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 100,
          opacity: containerSpring,
          transform: \`translateY(\${interpolate(containerSpring, [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            🎛️ Post-Processing
          </h2>
        </div>

        <div style={{
          width: 600,
          background: \`linear-gradient(180deg, \${COLORS.zinc900} 0%, \${COLORS.black} 100%)\`,
          borderRadius: 20,
          border: \`1px solid \${COLORS.zinc800}\`,
          padding: 40,
          transform: \`scale(\${containerSpring})\`,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          marginTop: 60,
        }}>
          {sliders.map((slider, i) => {
            const sliderSpring = spring({ frame: frame - slider.delay, fps, config: { damping: 20, stiffness: 100 } });
            const animatedValue = slider.value * sliderSpring;

            return (
              <div key={i} style={{ marginBottom: i < sliders.length - 1 ? 24 : 0, opacity: sliderSpring }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: COLORS.zinc400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {slider.label}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 14, color: COLORS.zinc500 }}>
                    {Math.round(animatedValue)}
                  </span>
                </div>
                <div style={{ height: 8, background: COLORS.zinc800, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: \`\${animatedValue}%\`,
                    height: '100%',
                    background: \`linear-gradient(90deg, \${slider.color}80, \${slider.color})\`,
                    borderRadius: 4,
                    boxShadow: \`0 0 10px \${slider.color}40\`,
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: \`\${animatedValue}%\`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: COLORS.white,
                    border: \`2px solid \${slider.color}\`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 7: DISTRIBUTION - FLYING ICONS
// ============================================
const Scene7Distribution = ({ frame, fps }) => {
  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  const platforms = [
    { icon: '🐦', color: '#1da1f2', angle: 0, delay: 15 },
    { icon: '▶️', color: '#ff0000', angle: 72, delay: 20 },
    { icon: '📷', color: '#e4405f', angle: 144, delay: 25 },
    { icon: '💼', color: '#0077b5', angle: 216, delay: 30 },
    { icon: '📤', color: COLORS.cyberPurple, angle: 288, delay: 35 },
  ];

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 100,
          opacity: titleSpring,
          transform: \`translateY(\${interpolate(titleSpring, [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            📤 Distribution
          </h2>
        </div>

        <div style={{ position: 'relative', width: 100, height: 100 }}>
          <div style={{
            position: 'absolute',
            inset: -50,
            background: \`radial-gradient(circle, \${COLORS.electricBlue}40 0%, transparent 70%)\`,
            filter: 'blur(20px)',
          }} />

          {platforms.map(({ icon, color, angle, delay }, i) => {
            const flySpring = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 40, mass: 0.8 } });
            const angleRad = angle * (Math.PI / 180);
            const distance = 280 * flySpring;
            const x = Math.cos(angleRad) * distance;
            const y = Math.sin(angleRad) * distance;
            const rotation = interpolate(flySpring, [0, 1], [180, 0]);
            const scale = interpolate(flySpring, [0, 0.5, 1], [0, 1.2, 1]);

            return (
              <div key={i} style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: \`translate(calc(-50% + \${x}px), calc(-50% + \${y}px)) rotate(\${rotation}deg) scale(\${scale})\`,
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: \`linear-gradient(135deg, \${COLORS.zinc800}, \${COLORS.zinc900})\`,
                  border: \`2px solid \${color}50\`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: \`0 20px 40px rgba(0,0,0,0.4), 0 0 30px \${color}30\`,
                  fontSize: 40,
                }}>
                  {icon}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 8: ANALYTICS - SELF-DRAWING GRAPH
// ============================================
const Scene8Analytics = ({ frame, fps }) => {
  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const dataPoints = [10, 25, 20, 45, 35, 60, 55, 75, 70, 90];
  const graphWidth = 700;
  const graphHeight = 300;
  const drawProgress = interpolate(frame, [15, 75], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const pathD = dataPoints.map((point, i) => {
    const x = (i / (dataPoints.length - 1)) * graphWidth;
    const y = graphHeight - (point / 100) * graphHeight;
    return \`\${i === 0 ? 'M' : 'L'} \${x} \${y}\`;
  }).join(' ');

  const pathLength = 1200;

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 100,
          opacity: titleSpring,
          transform: \`translateY(\${interpolate(titleSpring, [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            📊 Analytics
          </h2>
        </div>

        <div style={{
          width: graphWidth + 80,
          height: graphHeight + 80,
          background: \`linear-gradient(180deg, \${COLORS.zinc900} 0%, \${COLORS.black} 100%)\`,
          borderRadius: 20,
          border: \`1px solid \${COLORS.zinc800}\`,
          padding: 40,
          transform: \`scale(\${titleSpring})\`,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          marginTop: 60,
        }}>
          <svg width={graphWidth} height={graphHeight} style={{ overflow: 'visible' }}>
            {[0, 25, 50, 75, 100].map((val, i) => {
              const y = graphHeight - (val / 100) * graphHeight;
              return <line key={i} x1={0} y1={y} x2={graphWidth} y2={y} stroke={COLORS.zinc800} strokeWidth={1} opacity={0.5} />;
            })}
            <path d={pathD} fill="none" stroke={COLORS.electricBlue} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'blur(12px)' }} opacity={0.5} strokeDasharray={pathLength} strokeDashoffset={pathLength * (1 - drawProgress)} />
            <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pathLength} strokeDashoffset={pathLength * (1 - drawProgress)} />
            {dataPoints.map((point, i) => {
              const pointProgress = interpolate(drawProgress, [i / dataPoints.length, (i + 1) / dataPoints.length], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
              const x = (i / (dataPoints.length - 1)) * graphWidth;
              const y = graphHeight - (point / 100) * graphHeight;
              return <circle key={i} cx={x} cy={y} r={6 * pointProgress} fill={COLORS.electricBlue} opacity={pointProgress} />;
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLORS.cyberPurple} />
                <stop offset="100%" stopColor={COLORS.electricBlue} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 9: COMMUNITY - POPPING AVATARS
// ============================================
const Scene9Community = ({ frame, fps }) => {
  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  const avatars = [
    { x: 0, y: 0, size: 80, delay: 10 },
    { x: -120, y: -60, size: 60, delay: 15 },
    { x: 130, y: -50, size: 65, delay: 18 },
    { x: -180, y: 40, size: 55, delay: 22 },
    { x: 160, y: 70, size: 58, delay: 25 },
    { x: -80, y: 100, size: 50, delay: 28 },
    { x: 60, y: -110, size: 52, delay: 32 },
    { x: -220, y: -30, size: 45, delay: 35 },
    { x: 220, y: 20, size: 48, delay: 38 },
    { x: 0, y: 130, size: 54, delay: 42 },
  ];

  const colors = [COLORS.electricBlue, COLORS.cyberPurple, '#10b981', '#f59e0b', '#ef4444'];

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 100,
          opacity: titleSpring,
          transform: \`translateY(\${interpolate(titleSpring, [0, 1], [20, 0])}px)\`,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            👥 Community
          </h2>
        </div>

        <div style={{ position: 'relative', width: 500, height: 350, marginTop: 60 }}>
          {avatars.map((avatar, i) => {
            const avatarSpring = spring({ frame: frame - avatar.delay, fps, config: { damping: 8, stiffness: 150, mass: 0.5 } });
            const bounceY = Math.sin((frame - avatar.delay) * 0.1) * 3 * (avatarSpring > 0.9 ? 1 : 0);
            const color = colors[i % colors.length];

            return (
              <div key={i} style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: \`translate(calc(-50% + \${avatar.x}px), calc(-50% + \${avatar.y + bounceY}px)) scale(\${avatarSpring})\`,
                width: avatar.size,
                height: avatar.size,
                borderRadius: '50%',
                background: \`linear-gradient(135deg, \${color}40, \${color}20)\`,
                border: \`2px solid \${color}60\`,
                boxShadow: \`0 10px 30px rgba(0,0,0,0.3), 0 0 20px \${color}20\`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: avatar.size * 0.45,
              }}>
                👤
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// SCENE 10: CTA - SHIMMERING BUTTON
// ============================================
const Scene10CTA = ({ frame, fps }) => {
  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const buttonSpring = spring({ frame: frame - 20, fps, config: { damping: 10, stiffness: 60 } });
  const shimmerX = interpolate(frame % 60, [0, 60], [-100, 400]);
  const pulseScale = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.02]);

  return (
    <AnimatedBackground frame={frame}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 50 }}>
        <div style={{
          textAlign: 'center',
          transform: \`translateY(\${interpolate(titleSpring, [0, 1], [40, 0])}px)\`,
          opacity: titleSpring,
        }}>
          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: \`linear-gradient(135deg, \${COLORS.white}, \${COLORS.zinc300})\`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Scale Your Vision
          </h2>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 24,
            fontWeight: 400,
            color: COLORS.zinc500,
            marginTop: 20,
          }}>
            Start creating content that matters
          </p>
        </div>

        <div style={{ transform: \`scale(\${buttonSpring * pulseScale})\`, opacity: buttonSpring }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
            <div style={{
              padding: '24px 64px',
              background: \`linear-gradient(135deg, \${COLORS.electricBlue}, \${COLORS.cyberPurple})\`,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: \`0 20px 50px \${COLORS.electricBlue}40, 0 10px 30px \${COLORS.cyberPurple}30\`,
            }}>
              <span style={{ fontSize: 28 }}>🚀</span>
              <span style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: '0.02em',
              }}>
                Get Started Free
              </span>
            </div>
            <div style={{
              position: 'absolute',
              top: 0,
              left: shimmerX,
              width: 100,
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        </div>

        {Array.from({ length: 12 }).map((_, i) => {
          const particleSpring = spring({ frame: frame - i * 3, fps, config: { damping: 15, stiffness: 50 } });
          const floatY = Math.sin((frame + i * 30) * 0.03) * 20;
          const floatX = Math.cos((frame + i * 25) * 0.02) * 15;
          const startX = (i % 4 - 1.5) * 400;
          const startY = Math.floor(i / 4 - 1) * 200;

          return (
            <div key={i} style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: \`translate(calc(-50% + \${startX + floatX}px), calc(-50% + \${startY + floatY}px))\`,
              width: 6 + (i % 3) * 2,
              height: 6 + (i % 3) * 2,
              borderRadius: '50%',
              background: i % 2 === 0 ? COLORS.electricBlue : COLORS.cyberPurple,
              opacity: particleSpring * 0.4,
              filter: 'blur(1px)',
            }} />
          );
        })}
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const getSceneFrame = (sceneIndex) => frame - (sceneIndex * SCENE_DURATION);
const isInScene = (sceneIndex) => {
  const sceneStart = sceneIndex * SCENE_DURATION;
  return frame >= sceneStart && frame < sceneStart + SCENE_DURATION;
};

return (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={SCENE_DURATION}>
      <Scene1Title frame={getSceneFrame(0)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
      <Scene2Ideation frame={getSceneFrame(1)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
      <Scene3Scripting frame={getSceneFrame(2)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
      <Scene4VisualDesign frame={getSceneFrame(3)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
      <Scene5Production frame={getSceneFrame(4)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION}>
      <Scene6PostProcessing frame={getSceneFrame(5)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION}>
      <Scene7Distribution frame={getSceneFrame(6)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 7} durationInFrames={SCENE_DURATION}>
      <Scene8Analytics frame={getSceneFrame(7)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 8} durationInFrames={SCENE_DURATION}>
      <Scene9Community frame={getSceneFrame(8)} fps={fps} />
    </Sequence>
    <Sequence from={SCENE_DURATION * 9} durationInFrames={SCENE_DURATION}>
      <Scene10CTA frame={getSceneFrame(9)} fps={fps} />
    </Sequence>
  </AbsoluteFill>
);`,
};
