import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PricingActions from "./PricingActions";

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-[#d4a853] shrink-0 mt-0.5" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FREE_FEATURES = [
  "2 analyses par jour",
  "Score IA 0–100",
  "Analyse par critère",
  "Prochaines étapes recommandées",
  "Historique des analyses",
];

const PRO_FEATURES = [
  "Analyses illimitées",
  "Score IA 0–100",
  "Analyse par critère",
  "Prochaines étapes recommandées",
  "Historique des analyses",
];

export default async function PricingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPro = sub?.plan === "pro" && sub?.status === "active";

  return (
    <main className="relative min-h-screen pl-24 pr-8 pt-24 pb-16">
      <div className="max-w-2xl">
        <header className="mb-14">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#d4a853] mb-5">
            INTELLIGENCE PROSPECT
          </p>
          <h1
            className="font-display font-300 text-[#ede8de] leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 52px)" }}
          >
            Tarification<em className="not-italic font-700">.</em>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1c1b18]">
          {/* FREE */}
          <div className="bg-[#080806] p-8 flex flex-col">
            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#4e4b44] mb-4">GRATUIT</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-700 text-4xl text-[#ede8de]">0€</span>
                <span className="font-mono text-[10px] text-[#4e4b44] tracking-wider">/MOIS</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="font-body font-300 text-sm text-[#4e4b44]">{f}</span>
                </li>
              ))}
            </ul>
            <div className="py-4 text-center font-mono text-[10px] tracking-[0.3em] text-[#2e2d2a] border border-[#1c1b18]">
              {isPro ? "PLAN DE BASE" : "PLAN ACTUEL"}
            </div>
          </div>

          {/* PRO */}
          <div className="bg-[#080806] p-8 flex flex-col border border-[#d4a853]/20">
            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#d4a853] mb-4">PRO</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-700 text-4xl text-[#ede8de]">20€</span>
                <span className="font-mono text-[10px] text-[#4e4b44] tracking-wider">/MOIS</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PRO_FEATURES.map((f, i) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className={`font-body font-300 text-sm ${i === 0 ? "text-[#ede8de]" : "text-[#4e4b44]"}`}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <PricingActions isPro={isPro} />
          </div>
        </div>
      </div>
    </main>
  );
}
