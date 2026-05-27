import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isPro = false;
  if (user) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .single();
    isPro = sub?.plan === "pro" && sub?.status === "active";
  }

  return (
    <nav className="fixed top-0 right-0 z-50 flex items-center gap-6 px-8 py-5">
      {user ? (
        <>
          {isPro ? (
            <span className="font-mono text-[9px] tracking-[0.3em] px-2 py-0.5 border border-[#d4a853]/40 text-[#d4a853]">
              PRO
            </span>
          ) : (
            <Link
              href="/pricing"
              className="font-mono text-[10px] tracking-[0.3em] text-[#4e4b44] hover:text-[#d4a853] transition-colors duration-200"
            >
              MISE À NIVEAU
            </Link>
          )}
          <Link
            href="/history"
            className="font-mono text-[10px] tracking-[0.3em] text-[#4e4b44] hover:text-[#d4a853] transition-colors duration-200"
          >
            HISTORIQUE
          </Link>
          <span className="font-mono text-[10px] text-[#4e4b44] tracking-wider truncate max-w-[180px]">
            {user.email}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="font-mono text-[10px] tracking-[0.3em] text-[#d4a853] hover:underline underline-offset-4 transition-colors duration-200"
            >
              DÉCONNEXION
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/login"
          className="font-mono text-[10px] tracking-[0.3em] text-[#d4a853] hover:underline underline-offset-4"
        >
          CONNEXION
        </Link>
      )}
    </nav>
  );
}
