"use client";

import { useState } from "react";
import type { LeadInput, QualificationResult } from "@/lib/types";
import QualificationResultPanel from "@/components/QualificationResult";
import { createCheckoutSession } from "./actions";

type AppState = "form" | "loading" | "result" | "error" | "limit";

const EMPTY: LeadInput = {
  companyName: "",
  contactName: "",
  email: "",
  role: "",
  companySize: "11-50",
  budget: "$1k-$10k",
  timeline: "1-3 months",
  useCase: "",
  additionalNotes: "",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono text-[10px] tracking-[0.28em] text-[#4e4b44] uppercase mb-2">
      {children}
    </label>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -left-2 -top-8 font-display text-[120px] font-700 leading-none select-none pointer-events-none"
      style={{ color: "rgba(212,168,83,0.04)" }}
    >
      {n}
    </span>
  );
}

function LoadingState() {
  const letters = "ANALYSE".split("");
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center pl-24 pr-8">
      <div className="text-center">
        {/* Radar circle */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#201e18" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="#201e18" strokeWidth="1" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="#d4a853"
              strokeWidth="1"
              strokeDasharray="251"
              strokeDashoffset="251"
              style={{ animation: "radar-draw 2s linear infinite" }}
            />
            <line x1="50" y1="50" x2="50" y2="10"
              stroke="#d4a853" strokeWidth="1" opacity="0.4"
              style={{ transformOrigin: "50px 50px", animation: "radar-spin 2s linear infinite" }}
            />
          </svg>
        </div>

        {/* Animated letters */}
        <div className="flex justify-center gap-1 mb-4">
          {letters.map((l, i) => (
            <span
              key={i}
              className="font-mono text-sm tracking-widest text-[#d4a853]"
              style={{
                animation: `letter-wave 1.4s ease-in-out ${i * 0.1}s infinite`,
              }}
            >
              {l}
            </span>
          ))}
          <span className="font-mono text-sm text-[#d4a853] blink ml-1">_</span>
        </div>

        <p className="font-display text-2xl font-300 text-[#ede8de]">Analyse en cours</p>
        <p className="font-mono text-xs text-[#3a3830] tracking-widest mt-2">
          Qualification IA en cours — cela peut prendre un moment
        </p>
      </div>
    </main>
  );
}

export default function Home() {
  const [state, setState] = useState<AppState>("form");
  const [form, setForm] = useState<LeadInput>(EMPTY);
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof LeadInput, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleAnalyze() {
    if (!form.companyName || !form.contactName || !form.email || !form.role || !form.useCase) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setErrorMsg("");
    setState("loading");

    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 429) {
        const data = await res.json();
        if (data.error === "daily_limit_reached") {
          setState("limit");
          return;
        }
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setState("result");
    } catch {
      setState("error");
    }
  }

  function UpgradeButton() {
    const [loading, setLoading] = useState(false);
    const [upgradeError, setUpgradeError] = useState("");
    async function handleUpgrade() {
      setLoading(true);
      setUpgradeError("");
      try {
        const url = await createCheckoutSession();
        if (url) window.location.href = url;
        else {
          setUpgradeError("Impossible de créer la session. Vérifiez la configuration Stripe.");
          setLoading(false);
        }
      } catch {
        setUpgradeError("Une erreur est survenue. Veuillez réessayer.");
        setLoading(false);
      }
    }
    return (
      <div className="space-y-3">
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="group relative w-full py-5 border border-[#d4a853] overflow-hidden disabled:opacity-40"
        >
          <span className="absolute inset-0 bg-[#d4a853] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span className="relative z-10 font-mono text-xs tracking-[0.35em] text-[#d4a853] group-hover:text-[#080806] transition-colors duration-300">
            {loading ? "REDIRECTION..." : "PASSER AU PLAN PRO — 20€/MOIS"}
          </span>
        </button>
        {upgradeError && (
          <p className="font-mono text-[10px] text-red-400 tracking-wide text-center">{upgradeError}</p>
        )}
      </div>
    );
  }

  if (state === "loading") return <LoadingState />;

  if (state === "limit") {
    return (
      <main className="relative min-h-screen pl-24 pr-8 flex items-center justify-start">
        <div className="w-full max-w-sm">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#d4a853] mb-5">LIMITE ATTEINTE</p>
          <h2 className="font-display font-300 text-[#ede8de] text-4xl mb-6 leading-tight">
            2 analyses<br /><em className="not-italic font-700">par jour.</em>
          </h2>
          <p className="font-body font-300 text-sm text-[#4e4b44] leading-relaxed mb-8">
            Vous avez atteint la limite quotidienne du plan gratuit.
            Passez au plan Pro pour des analyses illimitées.
          </p>
          <div className="space-y-4">
            <UpgradeButton />
            <button
              onClick={() => setState("form")}
              className="block w-full text-center font-mono text-[10px] tracking-[0.3em] text-[#4e4b44] hover:text-[#d4a853] transition-colors duration-200 py-2"
            >
              RETOUR AU FORMULAIRE
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (state === "result" && result) {
    return (
      <QualificationResultPanel
        result={result}
        onReset={() => { setForm(EMPTY); setState("form"); }}
      />
    );
  }

  return (
    <main className="relative min-h-screen pl-24 pr-8 pt-16 pb-24">
      <div className="max-w-2xl">

        {/* Header */}
        <header className="mb-16">
          <p className="reveal d1 font-mono text-[10px] tracking-[0.4em] text-[#d4a853] mb-5">
            SYSTÈME D&apos;INTELLIGENCE PROSPECT
          </p>
          <h1 className="reveal d2 font-display font-300 leading-[0.9] text-[#ede8de] mb-6" style={{ fontSize: "clamp(52px, 8vw, 80px)" }}>
            Qualifiez<br />
            <em className="not-italic font-700">votre prospect.</em>
          </h1>
          <p className="reveal d3 font-body font-300 text-sm text-[#4e4b44] max-w-xs leading-relaxed">
            Soumettez les informations ci-dessous. Notre IA retourne un score, un niveau et un raisonnement stratégique.
          </p>
        </header>

        {/* ── Section 01 ── */}
        <section className="relative mb-14">
          <SectionNumber n="01" />
          <p className="reveal d4 font-mono text-[10px] tracking-[0.3em] text-[#2e2c26] mb-6 pb-2 border-b border-[#181610]">
            INFORMATIONS DE CONTACT
          </p>
          <div className="reveal d4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <FieldLabel>Nom de l&apos;entreprise *</FieldLabel>
              <input className="field" placeholder="Acme SAS" value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Nom du contact *</FieldLabel>
              <input className="field" placeholder="Marie Dupont" value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Email *</FieldLabel>
              <input className="field" type="email" placeholder="marie@acme.fr" value={form.email}
                onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Rôle / Titre *</FieldLabel>
              <input className="field" placeholder="Directeur Technique" value={form.role}
                onChange={(e) => set("role", e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Section 02 ── */}
        <section className="relative mb-14">
          <SectionNumber n="02" />
          <p className="reveal d5 font-mono text-[10px] tracking-[0.3em] text-[#2e2c26] mb-6 pb-2 border-b border-[#181610]">
            SIGNAUX DE QUALIFICATION
          </p>
          <div className="reveal d5 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <div>
              <FieldLabel>Taille de l&apos;entreprise</FieldLabel>
              <select className="field" value={form.companySize}
                onChange={(e) => set("companySize", e.target.value as LeadInput["companySize"])}>
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>201-1000</option>
                <option>1000+</option>
              </select>
            </div>
            <div>
              <FieldLabel>Budget</FieldLabel>
              <select className="field" value={form.budget}
                onChange={(e) => set("budget", e.target.value as LeadInput["budget"])}>
                <option value="<$1k">{"<$1k"}</option>
                <option>$1k-$10k</option>
                <option>$10k-$50k</option>
                <option>$50k+</option>
              </select>
            </div>
            <div>
              <FieldLabel>Horizon temporel</FieldLabel>
              <select className="field" value={form.timeline}
                onChange={(e) => set("timeline", e.target.value as LeadInput["timeline"])}>
                <option>Immediate</option>
                <option>1-3 months</option>
                <option>3-6 months</option>
                <option>6+ months</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── Section 03 ── */}
        <section className="relative mb-12">
          <SectionNumber n="03" />
          <p className="reveal d6 font-mono text-[10px] tracking-[0.3em] text-[#2e2c26] mb-6 pb-2 border-b border-[#181610]">
            CONTEXTE D&apos;UTILISATION
          </p>
          <div className="reveal d6 space-y-6">
            <div>
              <FieldLabel>Cas d&apos;usage *</FieldLabel>
              <textarea className="field" rows={3}
                placeholder="Décrivez ce que le prospect souhaite accomplir..."
                value={form.useCase}
                onChange={(e) => set("useCase", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Notes complémentaires</FieldLabel>
              <textarea className="field" rows={2}
                placeholder="Tout autre contexte pertinent (facultatif)"
                value={form.additionalNotes}
                onChange={(e) => set("additionalNotes", e.target.value)} />
            </div>
          </div>
        </section>

        {/* Errors */}
        {errorMsg && (
          <p className="font-mono text-xs text-red-400 tracking-wide mb-4">{errorMsg}</p>
        )}
        {state === "error" && (
          <p className="font-mono text-xs text-red-400 tracking-wide mb-4">
            Analyse échouée. Vérifiez votre connexion et réessayez.
          </p>
        )}

        {/* CTA */}
        <div className="reveal d7 pt-2">
          <button
            onClick={handleAnalyze}
            className="group relative w-full py-5 border border-[#d4a853] overflow-hidden"
          >
            {/* Fill layer */}
            <span className="absolute inset-0 bg-[#d4a853] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10 font-mono text-xs tracking-[0.35em] text-[#d4a853] group-hover:text-[#080806] transition-colors duration-300">
              ANALYSER LE PROSPECT
            </span>
          </button>
        </div>

        {/* Footer */}
        <footer className="reveal d8 mt-14">
          <p className="font-mono text-[10px] text-[#232118] tracking-[0.22em]">
            PROPULSÉ PAR CLAUDE AI × TRIGGER.DEV
          </p>
        </footer>

      </div>
    </main>
  );
}
