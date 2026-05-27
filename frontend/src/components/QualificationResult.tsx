"use client";

import { useEffect, useState } from "react";
import type { QualificationResult, CriterionScore } from "@/lib/types";

const TIER = {
  Hot:  { color: "#34d399", label: "PROSPECT CHAUD",  glow: "rgba(52,211,153,0.15)"  },
  Warm: { color: "#fbbf24", label: "PROSPECT TIÈDE",  glow: "rgba(251,191,36,0.15)"  },
  Cold: { color: "#818cf8", label: "PROSPECT FROID",  glow: "rgba(129,140,248,0.15)" },
};

const R = 50;
const CIRC = 2 * Math.PI * R;

function scoreColor(s: number) {
  if (s >= 70) return "#34d399";
  if (s >= 40) return "#fbbf24";
  return "#f87171";
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-10">
      <div className="flex-1 h-px bg-[#201e18]" />
      <span className="font-mono text-[10px] tracking-[0.3em] text-[#3a3830]">{label}</span>
      <div className="flex-1 h-px bg-[#201e18]" />
    </div>
  );
}

function CriterionCard({ item, delay }: { item: CriterionScore; delay: string }) {
  const [barWidth, setBarWidth] = useState(0);
  const color = scoreColor(item.score);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(item.score), 400);
    return () => clearTimeout(t);
  }, [item.score]);

  return (
    <div
      className="reveal border border-[#201e18] bg-[#0c0b09] p-5 flex flex-col gap-3"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-body font-400 text-sm text-[#ede8de] leading-tight">
          {item.criterion}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-mono text-[10px] text-[#4e4b44] tracking-widest">
            {item.weight}%
          </span>
          <span
            className="font-mono text-lg font-500 leading-none"
            style={{ color }}
          >
            {item.score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-[#201e18] overflow-visible relative" style={{ height: 2 }}>
        <div
          className="absolute left-0 top-0 h-full transition-all duration-700 ease-out"
          style={{
            width: `${barWidth}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>

      {/* Explanation */}
      <p className="font-body font-300 text-xs text-[#5a5650] leading-relaxed">
        {item.explanation}
      </p>
    </div>
  );
}

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

        {/* ── En-tête ── */}
        <header className="mb-14">
          <p className="reveal d1 font-mono text-[10px] tracking-[0.4em] text-[#d4a853] mb-5">
            DOSSIER COMPLÉTÉ
          </p>
          <h2
            className="reveal d2 font-display font-300 text-[#ede8de] leading-tight"
            style={{ fontSize: "clamp(40px,6vw,64px)" }}
          >
            Évaluation<br />
            <em className="not-italic font-700">du prospect.</em>
          </h2>
        </header>

        {/* ── Score global ── */}
        <div className="reveal d3 flex items-center gap-10 mb-2">
          {/* Anneau */}
          <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40"
              style={{ backgroundColor: color }}
            />
            <svg width="160" height="160" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r={R} fill="none" stroke="#201e18" strokeWidth="3" />
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-700 text-[#ede8de]" style={{ fontSize: 52, lineHeight: 1 }}>
                {score}
              </span>
              <span className="font-mono text-[10px] tracking-widest mt-1 text-[#4e4b44]">/ 100</span>
            </div>
          </div>

          {/* Badge + niveau */}
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

        {/* ── Synthèse ── */}
        <Divider label="SYNTHÈSE" />
        <div className="reveal d4 mb-2">
          <p className="font-display font-300 text-xl text-[#8a8478] leading-relaxed">
            {result.reasoning}
          </p>
        </div>

        {/* ── Analyse par critère ── */}
        {result.breakdown?.length > 0 && (
          <>
            <Divider label="ANALYSE PAR CRITÈRE" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.breakdown.map((item, i) => (
                <CriterionCard
                  key={item.criterion}
                  item={item}
                  delay={`${0.1 + i * 0.08}s`}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Prochaines étapes ── */}
        {result.nextSteps?.length > 0 && (
          <>
            <Divider label="PROCHAINES ÉTAPES" />
            <ol className="space-y-3 mb-2">
              {result.nextSteps.map((step, i) => (
                <li
                  key={i}
                  className="reveal flex gap-4 items-start"
                  style={{ animationDelay: `${0.1 + i * 0.1}s`, opacity: 0 }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 border border-[#d4a853] flex items-center justify-center font-mono text-[10px] text-[#d4a853]"
                    style={{ marginTop: 2 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-body font-300 text-sm text-[#8a8478] leading-relaxed pt-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </>
        )}

        {/* ── Bouton CTA ── */}
        <div className="mt-12">
          <button
            onClick={onReset}
            className="group relative w-full py-5 border border-[#d4a853] overflow-hidden"
          >
            <span className="absolute inset-0 bg-[#d4a853] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10 font-mono text-xs tracking-[0.35em] text-[#d4a853] group-hover:text-[#080806] transition-colors duration-300">
              ANALYSER UN NOUVEAU PROSPECT
            </span>
          </button>
        </div>

      </div>
    </main>
  );
}
