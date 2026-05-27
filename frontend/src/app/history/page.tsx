import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Analysis = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string | null;
  score: number;
  tier: string;
  reasoning: string | null;
};

function TierBadge({ tier }: { tier: string }) {
  const styles: Record<string, string> = {
    Hot:  "text-[#2dd4a7] border-[#2dd4a7]/30 bg-[#2dd4a7]/5",
    Warm: "text-[#d4a853] border-[#d4a853]/30 bg-[#d4a853]/5",
    Cold: "text-[#5b9bd5] border-[#5b9bd5]/30 bg-[#5b9bd5]/5",
  };
  const labels: Record<string, string> = {
    Hot:  "CHAUD",
    Warm: "TIÈDE",
    Cold: "FROID",
  };
  return (
    <span className={`font-mono text-[9px] tracking-[0.3em] px-2 py-1 border ${styles[tier] ?? "text-[#4e4b44] border-[#4e4b44]/30"}`}>
      {labels[tier] ?? tier.toUpperCase()}
    </span>
  );
}

export default async function HistoryPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: analyses, error } = await supabase
    .from("lead_analyses")
    .select("id, created_at, company_name, contact_name, score, tier, reasoning")
    .order("created_at", { ascending: false });

  return (
    <main className="relative min-h-screen pl-24 pr-8 pt-24 pb-16">
      <div className="max-w-3xl">
        <header className="mb-12">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#d4a853] mb-5">
            INTELLIGENCE PROSPECT
          </p>
          <h1
            className="font-display font-300 text-[#ede8de] leading-tight mb-3"
            style={{ fontSize: "clamp(36px, 5vw, 52px)" }}
          >
            Historique<em className="not-italic font-700">.</em>
          </h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#4e4b44]">
            {analyses?.length ?? 0} ANALYSE{(analyses?.length ?? 0) !== 1 ? "S" : ""}
          </p>
        </header>

        {error && (
          <p className="font-mono text-xs text-red-400 tracking-wide mb-8">
            Erreur lors du chargement de l&apos;historique.
          </p>
        )}

        {!analyses || analyses.length === 0 ? (
          <div className="border border-[#1c1b18] p-8">
            <p className="font-body font-300 text-sm text-[#4e4b44] leading-relaxed">
              Aucune analyse pour l&apos;instant. Qualifiez votre premier prospect pour le voir apparaître ici.
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {analyses.map((a) => (
              <div
                key={a.id}
                className="group flex items-center gap-6 border border-[#1c1b18] px-6 py-5 hover:border-[#d4a853]/20 transition-colors duration-300"
              >
                {/* Score */}
                <div className="shrink-0 w-12 text-center">
                  <span
                    className="font-display font-700 text-2xl"
                    style={{
                      color:
                        a.tier === "Hot"
                          ? "#2dd4a7"
                          : a.tier === "Warm"
                          ? "#d4a853"
                          : "#5b9bd5",
                    }}
                  >
                    {a.score}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-300 text-[#ede8de] text-base leading-tight truncate">
                    {a.company_name}
                    {a.contact_name && (
                      <span className="text-[#4e4b44] font-300 ml-2 text-sm">
                        — {a.contact_name}
                      </span>
                    )}
                  </p>
                  {a.reasoning && (
                    <p className="font-body font-300 text-xs text-[#4e4b44] mt-1 line-clamp-1">
                      {a.reasoning}
                    </p>
                  )}
                </div>

                {/* Tier + Date */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <TierBadge tier={a.tier} />
                  <span className="font-mono text-[9px] text-[#2e2d2a] tracking-wider">
                    {new Date(a.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.3em] text-[#d4a853] hover:underline underline-offset-4"
          >
            ← NOUVELLE ANALYSE
          </Link>
        </div>
      </div>
    </main>
  );
}
