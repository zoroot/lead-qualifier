"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="relative min-h-screen pl-24 pr-8 flex items-center justify-start">
      <div className="w-full max-w-sm">
        <header className="mb-12">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#d4a853] mb-5">
            INTELLIGENCE PROSPECT
          </p>
          <h1
            className="font-display font-300 text-[#ede8de] leading-tight"
            style={{ fontSize: "clamp(40px, 6vw, 56px)" }}
          >
            Connexion<em className="not-italic font-700">.</em>
          </h1>
        </header>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.28em] text-[#4e4b44] uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              className="field"
              placeholder="marie@acme.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.28em] text-[#4e4b44] uppercase mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              className="field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-5 border border-[#d4a853] overflow-hidden disabled:opacity-40"
          >
            <span className="absolute inset-0 bg-[#d4a853] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10 font-mono text-xs tracking-[0.35em] text-[#d4a853] group-hover:text-[#080806] transition-colors duration-300">
              {loading ? "CONNEXION..." : "SE CONNECTER"}
            </span>
          </button>
        </form>

        <p className="mt-8 font-mono text-[10px] text-[#4e4b44] tracking-wider">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-[#d4a853] hover:underline underline-offset-4">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
