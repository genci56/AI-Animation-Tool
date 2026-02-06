import { RemotionExample } from "./index";

export const advancedShowcaseCode = `import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";

// ============== SCENE 1: 3D-like Logo Intro ==============
const LogoIntroScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animated background gradient
  const hue1 = interpolate(frame, [0, 90], [220, 280]);
  const hue2 = interpolate(frame, [0, 90], [260, 320]);

  // Logo entrance with 3D rotation effect
  const logoProgress = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const rotateY = interpolate(logoProgress, [0, 1], [90, 0]);
  const logoScale = interpolate(logoProgress, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);

  // Floating rings around logo
  const rings = Array.from({ length: 3 }, (_, i) => {
    const delay = i * 10;
    const ringProgress = spring({ frame: frame - delay - 20, fps, config: { damping: 15, stiffness: 60 } });
    const ringScale = interpolate(ringProgress, [0, 1], [0, 1 + i * 0.3], { extrapolateLeft: "clamp" });
    const ringOpacity = interpolate(ringProgress, [0, 1], [0, 0.3 - i * 0.08], { extrapolateLeft: "clamp" });
    const ringRotation = frame * (1 + i * 0.5);
    return { scale: ringScale, opacity: ringOpacity, rotation: ringRotation };
  });

  // Particle burst
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const delay = 15 + Math.random() * 10;
    const particleProgress = spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 100 } });
    const distance = interpolate(particleProgress, [0, 1], [0, 150 + Math.random() * 100], { extrapolateLeft: "clamp" });
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const particleOpacity = interpolate(frame - delay, [0, 30, 60], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const size = 4 + Math.random() * 6;
    return { x, y, opacity: particleOpacity, size };
  });

  return (
    <AbsoluteFill style={{ background: \`linear-gradient(135deg, hsl(\${hue1}, 70%, 15%) 0%, hsl(\${hue2}, 80%, 8%) 100%)\`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Particle burst */}
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: width / 2 + p.x, top: height / 2 + p.y, width: p.size, height: p.size, borderRadius: "50%", background: \`hsl(\${200 + i * 8}, 80%, 60%)\`, opacity: p.opacity }} />
      ))}

      {/* Animated rings */}
      {rings.map((ring, i) => (
        <div key={i} style={{ position: "absolute", width: 300 + i * 80, height: 300 + i * 80, border: "2px solid rgba(255,255,255,0.3)", borderRadius: "50%", opacity: ring.opacity, transform: \`scale(\${ring.scale}) rotate(\${ring.rotation}deg)\` }} />
      ))}

      {/* Main logo */}
      <div style={{ perspective: 1000, perspectiveOrigin: "center" }}>
        <div style={{ opacity: logoOpacity, transform: \`rotateY(\${rotateY}deg) scale(\${logoScale})\`, transformStyle: "preserve-3d" }}>
          <h1 style={{ fontSize: Math.round(width * 0.1), fontWeight: 900, color: "#ffffff", fontFamily: "Inter, sans-serif", textAlign: "center", margin: 0, textShadow: "0 0 60px rgba(139, 92, 246, 0.8), 0 0 120px rgba(139, 92, 246, 0.4)", letterSpacing: -4 }}>
            ANALYTICS
          </h1>
          <p style={{ fontSize: Math.round(width * 0.02), color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", textAlign: "center", marginTop: 10, letterSpacing: 8, textTransform: "uppercase" }}>
            Data Driven Insights
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 2: Animated Stats Counter ==============
const StatsCounterScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const stats = [
    { value: 2500000, label: "Users", prefix: "", suffix: "+", color: "#22c55e" },
    { value: 99.9, label: "Uptime", prefix: "", suffix: "%", color: "#3b82f6" },
    { value: 150, label: "Countries", prefix: "", suffix: "+", color: "#f59e0b" },
    { value: 4.9, label: "Rating", prefix: "", suffix: "/5", color: "#ec4899" },
  ];

  const titleProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <h2 style={{ fontSize: Math.round(width * 0.04), fontWeight: 800, color: "#ffffff", fontFamily: "Inter, sans-serif", marginBottom: 80, opacity: titleProgress, transform: \`translateY(\${interpolate(titleProgress, [0, 1], [-30, 0])}px)\` }}>
        Trusted Worldwide
      </h2>

      <div style={{ display: "flex", gap: 60, flexWrap: "wrap", justifyContent: "center" }}>
        {stats.map((stat, i) => {
          const delay = i * 8 + 15;
          const countProgress = interpolate(frame - delay, [0, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
          const currentValue = stat.value * countProgress;
          const displayValue = stat.value >= 1000000 ? (currentValue / 1000000).toFixed(1) + "M" : stat.value >= 1000 ? (currentValue / 1000).toFixed(0) + "K" : stat.value % 1 !== 0 ? currentValue.toFixed(1) : Math.floor(currentValue).toString();
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 100 } });
          const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
          const cardY = interpolate(cardSpring, [0, 1], [40, 0], { extrapolateLeft: "clamp" });

          return (
            <div key={i} style={{ textAlign: "center", opacity: cardOpacity, transform: \`translateY(\${cardY}px)\` }}>
              <div style={{ fontSize: Math.round(width * 0.06), fontWeight: 900, color: stat.color, fontFamily: "Inter, sans-serif", lineHeight: 1 }}>
                {stat.prefix}{displayValue}{stat.suffix}
              </div>
              <div style={{ fontSize: Math.round(width * 0.018), color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", marginTop: 10, textTransform: "uppercase", letterSpacing: 2 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 3: Animated Bar Chart ==============
const BarChartScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const data = [
    { label: "Jan", value: 65, color: "#3b82f6" },
    { label: "Feb", value: 85, color: "#8b5cf6" },
    { label: "Mar", value: 45, color: "#ec4899" },
    { label: "Apr", value: 95, color: "#22c55e" },
    { label: "May", value: 75, color: "#f59e0b" },
    { label: "Jun", value: 100, color: "#ef4444" },
  ];

  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = height * 0.5;
  const barWidth = width * 0.08;
  const gap = width * 0.04;

  const titleProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ fontSize: Math.round(width * 0.035), fontWeight: 800, color: "#ffffff", fontFamily: "Inter, sans-serif", marginBottom: 60, opacity: titleProgress }}>
        Monthly Performance
      </h2>

      <div style={{ display: "flex", alignItems: "flex-end", gap, height: chartHeight }}>
        {data.map((item, i) => {
          const delay = i * 6 + 15;
          const barProgress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
          const barHeight = interpolate(barProgress, [0, 1], [0, (item.value / maxValue) * chartHeight], { extrapolateLeft: "clamp" });
          const labelOpacity = interpolate(frame - delay - 10, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: Math.round(width * 0.018), color: "#ffffff", fontFamily: "Inter, sans-serif", marginBottom: 10, opacity: labelOpacity, fontWeight: 700 }}>
                {item.value}%
              </div>
              <div style={{ width: barWidth, height: barHeight, background: \`linear-gradient(180deg, \${item.color} 0%, \${item.color}80 100%)\`, borderRadius: "8px 8px 0 0", boxShadow: \`0 0 30px \${item.color}40\` }} />
              <div style={{ fontSize: Math.round(width * 0.014), color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", marginTop: 15, opacity: labelOpacity }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 4: Animated Pie Chart ==============
const PieChartScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const data = [
    { label: "Product A", value: 35, color: "#3b82f6" },
    { label: "Product B", value: 25, color: "#8b5cf6" },
    { label: "Product C", value: 20, color: "#22c55e" },
    { label: "Product D", value: 20, color: "#f59e0b" },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = Math.min(width, height) * 0.2;
  const strokeWidth = 60;
  const circumference = 2 * Math.PI * radius;

  const titleProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  let cumulativeOffset = 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1e2e 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ position: "absolute", top: 80, fontSize: Math.round(width * 0.035), fontWeight: 800, color: "#ffffff", fontFamily: "Inter, sans-serif", opacity: titleProgress }}>
        Market Share
      </h2>

      <svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2} style={{ transform: "rotate(-90deg)" }}>
        {data.map((item, i) => {
          const segmentLength = (item.value / total) * circumference;
          const delay = i * 12 + 20;
          const segmentProgress = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
          const dashOffset = interpolate(segmentProgress, [0, 1], [segmentLength, 0]);
          const rotation = (cumulativeOffset / circumference) * 360;
          cumulativeOffset += segmentLength;

          return (
            <circle
              key={i}
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={\`\${segmentLength} \${circumference}\`}
              strokeDashoffset={dashOffset}
              style={{ transform: \`rotate(\${rotation}deg)\`, transformOrigin: "center" }}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ position: "absolute", right: 100, display: "flex", flexDirection: "column", gap: 20 }}>
        {data.map((item, i) => {
          const legendProgress = interpolate(frame - (i * 8 + 40), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 15, opacity: legendProgress }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: item.color }} />
              <span style={{ fontSize: Math.round(width * 0.016), color: "#ffffff", fontFamily: "Inter, sans-serif" }}>{item.label}</span>
              <span style={{ fontSize: Math.round(width * 0.016), color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>{item.value}%</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 5: Animated Line Graph ==============
const LineGraphScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const dataPoints = [
    { x: 0, y: 60 }, { x: 1, y: 45 }, { x: 2, y: 70 }, { x: 3, y: 55 },
    { x: 4, y: 80 }, { x: 5, y: 65 }, { x: 6, y: 90 }, { x: 7, y: 75 },
    { x: 8, y: 95 }, { x: 9, y: 85 }, { x: 10, y: 100 },
  ];

  const chartWidth = width * 0.7;
  const chartHeight = height * 0.45;
  const padding = 60;

  const scaleX = (x: number) => padding + (x / 10) * (chartWidth - padding * 2);
  const scaleY = (y: number) => chartHeight - padding - ((y - 40) / 70) * (chartHeight - padding * 2);

  const drawProgress = interpolate(frame, [15, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const visiblePoints = Math.floor(drawProgress * dataPoints.length);

  const pathD = dataPoints.slice(0, visiblePoints + 1).map((p, i) => {
    const progress = i < visiblePoints ? 1 : drawProgress * dataPoints.length - visiblePoints;
    const x = scaleX(p.x);
    const y = scaleY(p.y);
    const prevPoint = i > 0 ? dataPoints[i - 1] : p;
    const interpX = i < visiblePoints ? x : interpolate(progress, [0, 1], [scaleX(prevPoint.x), x]);
    const interpY = i < visiblePoints ? y : interpolate(progress, [0, 1], [scaleY(prevPoint.y), y]);
    return \`\${i === 0 ? "M" : "L"} \${interpX} \${interpY}\`;
  }).join(" ");

  const titleProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow dot at current position
  const currentPoint = dataPoints[Math.min(visiblePoints, dataPoints.length - 1)];
  const dotX = scaleX(currentPoint.x);
  const dotY = scaleY(currentPoint.y);
  const dotPulse = 1 + Math.sin(frame / 5) * 0.15;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ fontSize: Math.round(width * 0.035), fontWeight: 800, color: "#ffffff", fontFamily: "Inter, sans-serif", marginBottom: 40, opacity: titleProgress }}>
        Growth Trajectory
      </h2>

      <svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v, i) => {
          const y = scaleY(v + 40);
          const gridOpacity = interpolate(frame - i * 3, [0, 15], [0, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#ffffff" strokeOpacity={gridOpacity} strokeDasharray="5,5" />;
        })}

        {/* Gradient fill under line */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {visiblePoints > 0 && (
          <path d={\`\${pathD} L \${scaleX(dataPoints[Math.min(visiblePoints, dataPoints.length - 1)].x)} \${chartHeight - padding} L \${padding} \${chartHeight - padding} Z\`} fill="url(#lineGradient)" />
        )}

        {/* Main line */}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />

        {/* Glow dot */}
        {visiblePoints > 0 && (
          <>
            <circle cx={dotX} cy={dotY} r={20 * dotPulse} fill="#3b82f6" fillOpacity={0.3} />
            <circle cx={dotX} cy={dotY} r={8} fill="#3b82f6" stroke="#ffffff" strokeWidth={3} />
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ============== SCENE 6: Features Grid ==============
const FeaturesGridScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const features = [
    { icon: "🔒", title: "Secure", desc: "Bank-level encryption" },
    { icon: "⚡", title: "Fast", desc: "Sub-millisecond latency" },
    { icon: "🌐", title: "Global", desc: "150+ edge locations" },
    { icon: "🔄", title: "Sync", desc: "Real-time updates" },
    { icon: "📊", title: "Analytics", desc: "Deep insights" },
    { icon: "🛠️", title: "Flexible", desc: "Fully customizable" },
  ];

  const titleProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
      <h2 style={{ fontSize: Math.round(width * 0.04), fontWeight: 800, color: "#ffffff", fontFamily: "Inter, sans-serif", marginBottom: 60, opacity: titleProgress }}>
        Everything You Need
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, maxWidth: width * 0.8 }}>
        {features.map((f, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const delay = row * 10 + col * 5 + 15;
          const cardProgress = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 100 } });
          const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
          const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1], { extrapolateLeft: "clamp" });

          return (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 30, textAlign: "center", opacity: cardOpacity, transform: \`scale(\${cardScale})\`, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 48, marginBottom: 15 }}>{f.icon}</div>
              <h3 style={{ fontSize: Math.round(width * 0.02), fontWeight: 700, color: "#ffffff", fontFamily: "Inter, sans-serif", margin: 0 }}>{f.title}</h3>
              <p style={{ fontSize: Math.round(width * 0.012), color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", margin: "10px 0 0" }}>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 7: Testimonial ==============
const TestimonialScene = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const quoteProgress = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const authorProgress = spring({ frame: frame - 25, fps, config: { damping: 15, stiffness: 100 } });

  // Animated quote marks
  const quoteMarkScale = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0f0f1f 0%, #1f1f3f 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 100 }}>
      {/* Large quote mark */}
      <div style={{ position: "absolute", top: 120, left: 150, fontSize: 200, color: "rgba(139, 92, 246, 0.2)", fontFamily: "Georgia, serif", transform: \`scale(\${quoteMarkScale})\` }}>"</div>

      <p style={{ fontSize: Math.round(width * 0.032), color: "#ffffff", fontFamily: "Inter, sans-serif", textAlign: "center", maxWidth: width * 0.7, lineHeight: 1.6, fontWeight: 500, opacity: interpolate(quoteProgress, [0, 1], [0, 1]), transform: \`translateY(\${interpolate(quoteProgress, [0, 1], [30, 0])}px)\` }}>
        This platform transformed how we handle data analytics. The insights we've gained have directly contributed to a 40% increase in revenue.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50, opacity: interpolate(authorProgress, [0, 1], [0, 1], { extrapolateLeft: "clamp" }), transform: \`translateY(\${interpolate(authorProgress, [0, 1], [20, 0], { extrapolateLeft: "clamp" })}px)\` }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" }} />
        <div>
          <div style={{ fontSize: Math.round(width * 0.018), color: "#ffffff", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Sarah Chen</div>
          <div style={{ fontSize: Math.round(width * 0.014), color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>CEO, TechCorp Inc.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============== SCENE 8: Final CTA ==============
const FinalCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const buttonProgress = spring({ frame: frame - 20, fps, config: { damping: 10, stiffness: 120 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.04;

  // Animated background shapes
  const shapes = Array.from({ length: 6 }, (_, i) => {
    const size = 100 + i * 50;
    const x = (i % 3) * (width / 3) + width / 6;
    const y = Math.floor(i / 3) * (height / 2) + height / 4;
    const rotation = frame * (0.5 + i * 0.2);
    const shapeOpacity = interpolate(frame, [0, 30], [0, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, y, size, rotation, opacity: shapeOpacity };
  });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #1a0a2e 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Background shapes */}
      {shapes.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: s.x - s.size / 2, top: s.y - s.size / 2, width: s.size, height: s.size, border: "2px solid rgba(139, 92, 246, 0.3)", borderRadius: i % 2 === 0 ? "50%" : "20%", transform: \`rotate(\${s.rotation}deg)\`, opacity: s.opacity }} />
      ))}

      <h1 style={{ fontSize: Math.round(width * 0.06), fontWeight: 900, color: "#ffffff", fontFamily: "Inter, sans-serif", textAlign: "center", margin: 0, opacity: interpolate(titleProgress, [0, 1], [0, 1]), transform: \`translateY(\${interpolate(titleProgress, [0, 1], [50, 0])}px) scale(\${interpolate(titleProgress, [0, 1], [0.9, 1])})\` }}>
        Start Your Journey
      </h1>

      <p style={{ fontSize: Math.round(width * 0.02), color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", marginTop: 20, opacity: interpolate(titleProgress, [0, 1], [0, 1]) }}>
        Join thousands of companies already using our platform
      </p>

      <div style={{ display: "flex", gap: 20, marginTop: 50, opacity: interpolate(buttonProgress, [0, 1], [0, 1], { extrapolateLeft: "clamp" }), transform: \`scale(\${interpolate(buttonProgress, [0, 1], [0.5, 1], { extrapolateLeft: "clamp" }) * pulse})\` }}>
        <div style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)", padding: "20px 50px", borderRadius: 50, boxShadow: "0 10px 40px rgba(139, 92, 246, 0.5)" }}>
          <span style={{ fontSize: Math.round(width * 0.02), fontWeight: 700, color: "#ffffff", fontFamily: "Inter, sans-serif" }}>Get Started Free</span>
        </div>
        <div style={{ background: "transparent", padding: "20px 50px", borderRadius: 50, border: "2px solid rgba(255,255,255,0.3)" }}>
          <span style={{ fontSize: Math.round(width * 0.02), fontWeight: 700, color: "#ffffff", fontFamily: "Inter, sans-serif" }}>Watch Demo</span>
        </div>
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
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}><LogoIntroScene /></Sequence>
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}><StatsCounterScene /></Sequence>
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} premountFor={fps}><BarChartScene /></Sequence>
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION} premountFor={fps}><PieChartScene /></Sequence>
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION} premountFor={fps}><LineGraphScene /></Sequence>
      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION} premountFor={fps}><FeaturesGridScene /></Sequence>
      <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION} premountFor={fps}><TestimonialScene /></Sequence>
      <Sequence from={SCENE_DURATION * 7} durationInFrames={SCENE_DURATION} premountFor={fps}><FinalCTAScene /></Sequence>
    </AbsoluteFill>
  );
};`;

export const advancedShowcaseExample: RemotionExample = {
  id: "advanced-showcase",
  name: "Advanced Analytics Showcase",
  description: "8-scene animation with 3D effects, animated charts (bar, pie, line), stats counters, feature grid, and testimonials",
  category: "Showcase",
  durationInFrames: 720, // 24 seconds at 30fps (8 scenes x 3 seconds)
  fps: 30,
  code: advancedShowcaseCode,
};
