import { useState, useEffect } from "react";

const scenarios = {
  content: {
    name: "Content Creator",
    description: "Voice memos → polished content",
    icon: "✦",
    inputs: {
      recordingsPerMonth: 20,
      minutesManual: 35,
      minutesAuto: 8,
      hourlyRate: 35,
      avgRecordingMinutes: 5,
    },
  },
  consulting: {
    name: "Consulting Firm",
    description: "Client calls → documented insights",
    icon: "◈",
    inputs: {
      recordingsPerMonth: 40,
      minutesManual: 30,
      minutesAuto: 10,
      hourlyRate: 150,
      avgRecordingMinutes: 45,
    },
  },
  therapy: {
    name: "Private Practice",
    description: "Session notes without typing",
    icon: "◎",
    inputs: {
      recordingsPerMonth: 75,
      minutesManual: 18,
      minutesAuto: 5,
      hourlyRate: 160,
      avgRecordingMinutes: 50,
    },
  },
  legal: {
    name: "Legal Team",
    description: "Privileged calls → secure transcripts",
    icon: "⬡",
    inputs: {
      recordingsPerMonth: 30,
      minutesManual: 15,
      minutesAuto: 5,
      hourlyRate: 315,
      avgRecordingMinutes: 35,
    },
  },
  education: {
    name: "Education Business",
    description: "Course content → materials",
    icon: "◇",
    inputs: {
      recordingsPerMonth: 12,
      minutesManual: 180,
      minutesAuto: 45,
      hourlyRate: 50,
      avgRecordingMinutes: 60,
    },
  },
};

function getScenarioCosts(activeScenario, hourlyRate) {
  // Setup cost per scenario (one-time)
  const setupHours = activeScenario === 'legal' ? 4 : activeScenario === 'consulting' ? 6 : 5;
  const setupTimeCost = setupHours * hourlyRate;
  const vpsYearlyCost = activeScenario === 'content' ? 175 :
    activeScenario === 'consulting' ? 400 :
      activeScenario === 'therapy' ? 525 :
        activeScenario === 'legal' ? 450 :
          activeScenario === 'education' ? 350 :
            175; // fallback
  return { setupHours, setupTimeCost, vpsYearlyCost };
}

function calculate(inputs, activeScenario) {
  const { recordingsPerMonth, minutesManual, minutesAuto, hourlyRate, avgRecordingMinutes } = inputs;
  const { setupHours, setupTimeCost, vpsYearlyCost } = getScenarioCosts(activeScenario, hourlyRate);

  const timeSavedPerMonth = ((minutesManual - minutesAuto) * recordingsPerMonth) / 60;
  const moneySavedPerYear = timeSavedPerMonth * hourlyRate * 12;
  // Whisper API: $0.006/min; 
  // AI Processing (summary, formatting, extraction): ~$0.019/min - assumes Claude Sonnet or GPT-4
  const apiCostPerYear = avgRecordingMinutes * 0.025 * recordingsPerMonth * 12;
  const setupCost = setupTimeCost + vpsYearlyCost;
  const netSavings = moneySavedPerYear + apiCostPerYear - setupCost;
  const breakEvenMonths = setupCost / (moneySavedPerYear / 12 + apiCostPerYear / 12);
  return { timeSavedPerMonth, moneySavedPerYear, apiCostPerYear, setupCost, setupTimeCost, setupHours, vpsYearlyCost, netSavings, breakEvenMonths };
}

function AnimatedNumber({ value, prefix = "$", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + (end - start) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return (
    <span>
      {prefix}{Math.round(display).toLocaleString()}{suffix}
    </span>
  );
}

export default function ROICalculator() {
  const [active, setActive] = useState("consulting");
  const scenario = scenarios[active];
  const [inputs, setInputs] = useState(scenario.inputs);

  useEffect(() => {
    setInputs(scenarios[active].inputs);
  }, [active]);

  const r = calculate(inputs, active);

  const handleInput = (key, val) => {
    setInputs((prev) => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  const vpsMonthly = Math.round(r.vpsYearlyCost / 12);

  return (
    <div style={{ fontFamily: "'DM Mono', 'Fira Mono', monospace", minHeight: "100vh", background: "#0a0a0a", color: "#e8e0d0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .scenario-btn { background: none; border: 1px solid #2a2a2a; color: #888; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .scenario-btn:hover { border-color: #c8a96e; color: #c8a96e; }
        .scenario-btn.active { border-color: #c8a96e; background: #1a1408; color: #c8a96e; }
        .slider { -webkit-appearance: none; width: 100%; height: 2px; background: #2a2a2a; outline: none; border-radius: 1px; }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: #c8a96e; border-radius: 50%; cursor: pointer; }
        .slider::-moz-range-thumb { width: 14px; height: 14px; background: #c8a96e; border-radius: 50%; cursor: pointer; border: none; }
        .card { background: #111; border: 1px solid #1e1e1e; }
        .accent { color: #c8a96e; }
        .positive { color: #6db88a; }
        .negative { color: #c86e6e; }
        .bar-bg { background: #1a1a1a; border-radius: 2px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: 4, color: "#666", marginBottom: 12, textTransform: "uppercase" }}>Self-Hosted AI Transcription</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.05, color: "#e8e0d0" }}>
            ROI <span className="accent">Calculator</span>
          </h1>
          <p style={{ marginTop: 12, color: "#666", fontSize: 14, maxWidth: 480, lineHeight: 1.6 }}>
            Stop paying for the privilege of being someone's training data. Calculate your real savings.
          </p>
        </div>

        {/* Scenario Selector */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {Object.entries(scenarios).map(([key, s]) => (
            <button
              key={key}
              className={`scenario-btn${active === key ? " active" : ""}`}
              onClick={() => setActive(key)}
              style={{ padding: "10px 18px", borderRadius: 4, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Left: Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ padding: 24, borderRadius: 8 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 4, textTransform: "uppercase" }}>Scenario</p>
              <p style={{ fontSize: 18, color: "#e8e0d0", fontWeight: 500, marginBottom: 4 }}>{scenario.name}</p>
              <p style={{ fontSize: 13, color: "#666" }}>{scenario.description}</p>
            </div>

            {[
              { key: "recordingsPerMonth", label: "Recordings / Month", min: 1, max: 200, step: 1, suffix: "", prefix: "" },
              { key: "avgRecordingMinutes", label: "Avg Recording Length", min: 1, max: 120, step: 1, suffix: " min", prefix: "" },
              { key: "minutesManual", label: "Manual Processing Time", min: 1, max: 240, step: 1, suffix: " min", prefix: "" },
              { key: "minutesAuto", label: "Automated Processing Time", min: 1, max: 60, step: 1, suffix: " min", prefix: "" },
              { key: "hourlyRate", label: "Your Hourly Rate", min: 10, max: 1000, step: 5, suffix: "", prefix: "$" },
            ].map(({ key, label, min, max, step, suffix, prefix }) => (
              <div className="card" key={key} style={{ padding: 20, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: "#666", letterSpacing: 1 }}>{label}</span>
                  <span className="accent" style={{ fontSize: 14, fontWeight: 500 }}>{prefix}{inputs[key]}{suffix}</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min={min}
                  max={max}
                  step={step}
                  value={inputs[key]}
                  onChange={(e) => handleInput(key, e.target.value)}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: "#444" }}>{prefix}{min}{suffix}</span>
                  <span style={{ fontSize: 10, color: "#444" }}>{prefix}{max}{suffix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Net savings hero */}
            <div className="card" style={{ padding: 28, borderRadius: 8, borderColor: r.netSavings > 0 ? "#1e2e22" : "#2e1e1e", background: r.netSavings > 0 ? "#0d130e" : "#130d0d" }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>Year-One Net Savings</p>
              <div style={{ fontSize: "clamp(36px, 6vw, 52px)", fontFamily: "'Playfair Display', serif", fontWeight: 900, lineHeight: 1 }} className={r.netSavings > 0 ? "positive" : "negative"}>
                <AnimatedNumber value={r.netSavings} />
              </div>
              <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>
                Break-even in <span style={{ color: "#c8a96e" }}>{r.breakEvenMonths.toFixed(1)} months</span>
              </p>
            </div>

            {/* Time saved */}
            <div className="card" style={{ padding: 20, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 6 }}>Time Freed / Month</p>
                  <p style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#e8e0d0" }}>
                    <AnimatedNumber value={r.timeSavedPerMonth} prefix="" suffix="h" />
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 6 }}>Annual Value</p>
                  <p style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700 }} className="positive">
                    <AnimatedNumber value={r.moneySavedPerYear} />
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#555" }}>Manual</span>
                <span style={{ fontSize: 11, color: "#c86e6e" }}>{inputs.minutesManual} min/recording</span>
              </div>
              <div className="bar-bg" style={{ height: 6, marginBottom: 10 }}>
                <div className="bar-fill" style={{ width: "100%", background: "#c86e6e55" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#555" }}>Automated</span>
                <span style={{ fontSize: 11, color: "#6db88a" }}>{inputs.minutesAuto} min/recording</span>
              </div>
              <div className="bar-bg" style={{ height: 6 }}>
                <div className="bar-fill" style={{ width: `${(inputs.minutesAuto / inputs.minutesManual) * 100}%`, background: "#6db88a" }} />
              </div>
              <p style={{ fontSize: 11, color: "#555", marginTop: 8, textAlign: "right" }}>
                {Math.round((1 - inputs.minutesAuto / inputs.minutesManual) * 100)}% faster
              </p>
            </div>

            {/* CTA Card */}
            <div style={{
              padding: "20px 24px",
              borderRadius: 8,
              border: "1px solid #2a2010",
              background: "linear-gradient(135deg, #13100a 0%, #1a1408 60%, #12100d 100%)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "radial-gradient(ellipse at top left, #c8a96e0d 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <p style={{ fontSize: 13, color: "#c8b87a", lineHeight: 1.6, marginBottom: 14, position: "relative" }}>
                This is one automation.<br />
                <span style={{ color: "#e8d9b0", fontWeight: 500 }}>Imagine what 5–10 could save you.</span>
              </p>
              <a
                href="https://cal.com/cognistark/20min-call"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  borderRadius: 4,
                  background: "#c8a96e",
                  color: "#0a0a0a",
                  fontSize: 12,
                  fontFamily: "inherit",
                  fontWeight: 500,
                  letterSpacing: 0.3,
                  textDecoration: "none",
                  transition: "background 0.2s, transform 0.15s",
                  position: "relative",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#d4b87e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#c8a96e"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Schedule a call to explore your workflows
                <span style={{ fontSize: 14, lineHeight: 1 }}>→</span>
              </a>
            </div>

            {/* Cost breakdown */}
            <div className="card" style={{ padding: 20, borderRadius: 8 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 16 }}>Cost Breakdown</p>

              {[
                { label: "Time value recovered / year", value: r.moneySavedPerYear, color: "#6db88a", note: "at your hourly rate" },
                { label: "API costs avoided / year", value: r.apiCostPerYear, color: "#6db88a", note: "vs. SaaS pricing" },
                { label: "Setup time cost", value: -r.setupTimeCost, color: "#c86e6e", note: `${r.setupHours} hrs one-time` },
                { label: "VPS / year", value: -r.vpsYearlyCost, color: "#c86e6e", note: `~$${vpsMonthly}/mo hosting` },
              ].map(({ label, value, color, note }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <div>
                    <p style={{ fontSize: 13, color: "#aaa" }}>{label}</p>
                    <p style={{ fontSize: 11, color: "#555" }}>{note}</p>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 500, color }}>
                    {value > 0 ? "+" : ""}
                    <AnimatedNumber value={value} />
                  </span>
                </div>
              ))}
            </div>

            {/* Break-even visual */}
            <div className="card" style={{ padding: 20, borderRadius: 8 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 16 }}>12-Month Trajectory</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 64 }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1;
                  const cumulative = (r.moneySavedPerYear / 12 + r.apiCostPerYear / 12) * month - r.setupCost;
                  const maxVal = r.moneySavedPerYear + r.apiCostPerYear - r.setupCost;
                  const minVal = -r.setupCost;
                  const range = maxVal - minVal || 1;
                  const pct = Math.max(0, (cumulative - minVal) / range);
                  const isProfitable = cumulative >= 0;
                  return (
                    <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: "100%", height: 52, display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          width: "100%",
                          height: `${Math.max(4, pct * 100)}%`,
                          background: isProfitable ? "#6db88a" : "#c8a96e33",
                          borderRadius: "2px 2px 0 0",
                          transition: "height 0.5s ease",
                          border: month === Math.ceil(r.breakEvenMonths) ? "1px solid #c8a96e" : "none"
                        }} />
                      </div>
                      <span style={{ fontSize: 9, color: "#444" }}>{month}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, background: "#c8a96e33", borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: "#555" }}>Pre-breakeven</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, background: "#6db88a", borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: "#555" }}>Profitable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ marginTop: 32, fontSize: 11, color: "#555", textAlign: "center", letterSpacing: 1 }}>
          <p>© 2026 CogniStark.com</p>
          <p>
            <a
              href="mailto:contact@cognistark.com"
              className="text-slate-600 hover:text-slate-800 underline decoration-slate-400/70 hover:decoration-slate-700 transition"
            >
              contact@cognistark.com
            </a>
          </p>
        </p>
      </div>
    </div>
  );
}
