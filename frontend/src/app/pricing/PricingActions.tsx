"use client";

import { useState } from "react";
import { createCheckoutSession, createPortalSession } from "@/app/actions";

export default function PricingActions({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const url = await createCheckoutSession();
      if (url) {
        window.location.href = url;
      } else {
        setError("Impossible de créer la session. Vérifiez la configuration Stripe.");
        setLoading(false);
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    setError("");
    try {
      const url = await createPortalSession();
      if (url) {
        window.location.href = url;
      } else {
        setError("Aucun abonnement actif trouvé.");
        setLoading(false);
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {isPro ? (
        <button
          onClick={handlePortal}
          disabled={loading}
          className="w-full py-4 font-mono text-[10px] tracking-[0.3em] text-[#4e4b44] border border-[#1c1b18] hover:border-[#d4a853]/30 hover:text-[#d4a853] transition-colors duration-300 disabled:opacity-40"
        >
          {loading ? "REDIRECTION..." : "GÉRER MON ABONNEMENT"}
        </button>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="group relative w-full py-5 border border-[#d4a853] overflow-hidden disabled:opacity-40"
        >
          <span className="absolute inset-0 bg-[#d4a853] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span className="relative z-10 font-mono text-xs tracking-[0.35em] text-[#d4a853] group-hover:text-[#080806] transition-colors duration-300">
            {loading ? "REDIRECTION..." : "SOUSCRIRE — 20€/MOIS"}
          </span>
        </button>
      )}

      {error && (
        <p className="font-mono text-[10px] text-red-400 tracking-wide text-center">{error}</p>
      )}
    </div>
  );
}
