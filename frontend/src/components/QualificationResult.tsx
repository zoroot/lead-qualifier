"use client";

import { useEffect, useState } from "react";
import type { QualificationResult } from "@/lib/types";

const TIER = {
  Hot:  { color: "#34d399", label: "PROSPECT CHAUD",  glow: "rgba(52,211,153,0.15)"  },
  Warm: { color: "#fbbf24", label: "PROSPECT TIÈDE",  glow: "rgba(251,191,36,0.15)"  },
  Cold: { color: "#818cf8", label: "PROSPECT FROID",  glow: "rgba(129,140,248,0.15)" },
};

// r=50 → circumference = 2π×50 ≈ 314
const R = 50;
const CIRC = 2 * Math.PI * R;

interface Props {
  result: QualificationResult;
  onReset: () => void;
}

export default function QualificationResultPanel({ result, onReset }: Props) {
  const [score, setScore] = useState(0);
  const { color, label, glow } = TIER[result.tier];

  const ringOffset = CIRC - (score / 100) * CIRC;

  useEffect(() => {
    let current = 0;
    const target = result.score;
    const step = Math.max(1, Math.ceil(target / 55));
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setScore(current);
      if (current >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [result.score]);

  return (
    <main className="relative min-h-screen pl-24 pr-8 pt-16 pb-24">
      <div className="max-w-2xl">

        {/* Header */}
        <header className="mb-14">
          <p className="reveal d1 font-mono text-[10px] tracking-[0.4em] text-[#d4a853] mb-5">
            DOSSIER COMPLÉTÉ
          </p>
          <h2 className="reveal d2 font-display font-300 text-[#ede8de] leading-tight" style={{ fontSize: "clamp(40px,6vw,64px)" }}>
            Évaluation<br />
            <em className="not-italic font-700">du prospect.</em>
          </h2>
        </header>

        {/* Score block */}
        <div className="reveal d3 flex items-center gap-10 mb-14">

          {/* Ring */}
          <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40 transition-opacity duration-1000"
              style={{ backgroundColor: color }}
            />
            <svg width="160" height="160" viewBox="0 0 120 120" className="-rotate-90">
              {/* Track */}
              <circle cx="60" cy="60" r={R} fill="none" stroke="#201e18" strokeWidth="3" />
              {/* Progress */}
              <circle
                cx="60" cy="60" r={R}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={ringOffset}
                style={{
                  transition: "stroke-dashoffset 0.016s linear",
                  filter: `drop-shadow(0 0 8px ${color})`,
                }}
              />
            </svg>
            {/* Score number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-700 text-[#ede8de]" style={{ fontSize: 52, lineHeight: 1 }}>
                {score}
              </span>
              <span className="font-mono text-[10px] tracking-widest mt-1" style={{ color: "#4e4b44" }}>
                / 100
              </span>
            </div>
          </div>

          {/* Tier + meta */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 font-mono text-[10px] tracking-[0.25em]"
              style={{ border: `1px solid ${color}`, color, backgroundColor: glow }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </div>
            <p className="font-mono text-[10px] tracking-widest text-[#3a3830] uppercase">
              Score de qualification
            </p>
            <p className="font-display font-300 text-4xl text-[#ede8de] mt-1">
              {score >= 70 ? "Haute priorité" : score >= 40 ? "À suivre" : "Faible potentiel"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="reveal d4 flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#201e18]" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#3a3830]">RAISONNEMENT</span>
          <div className="flex-1 h-px bg-[#201e18]" />
        </div>

        {/* Reasoning */}
        <div className="reveal d5 mb-14">
          <p className="font-display font-300 text-xl text-[#8a8478] leading-relaxed">
            {result.reasoning}
          </p>
        </div>

        {/* Reset */}
        <div className="reveal d6">
          <button
            onClick={onReset}
            className="group inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-[#4e4b44] hover:text-[#d4a853] transition-colors duration-300"
          >
            <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-8" />
            ANALYSER UN AUTRE PROSPECT
          </button>
        </div>

      </div>
    </main>
  );
}
