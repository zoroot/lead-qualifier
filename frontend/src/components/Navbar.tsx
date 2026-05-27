import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 right-0 z-50 flex items-center gap-6 px-8 py-5">
      {user ? (
        <>
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
