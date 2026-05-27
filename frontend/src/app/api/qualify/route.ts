import { configure, tasks, runs } from "@trigger.dev/sdk";
import { createClient } from "@/lib/supabase/server";
import type { LeadInput, QualificationResult } from "@/lib/types";

configure({ secretKey: process.env.TRIGGER_SECRET_KEY! });

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { companyName, contactName, email, role, useCase } = body ?? {};
    if (!companyName?.trim() || !contactName?.trim() || !email?.trim() || !role?.trim() || !useCase?.trim()) {
      return Response.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return Response.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    const payload = body as LeadInput;

    const { id } = await tasks.trigger("qualify-lead", payload);
    const run = await runs.poll(id, { pollIntervalMs: 1500 });
    const result = run.output as QualificationResult;

    await supabase.from("lead_analyses").insert({
      user_id: user.id,
      company_name: payload.companyName,
      contact_name: payload.contactName ?? null,
      role: payload.role ?? null,
      score: result.score,
      tier: result.tier,
      reasoning: result.reasoning ?? null,
      breakdown: result.breakdown ?? null,
      next_steps: result.nextSteps ?? null,
      input: payload,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Qualify error:", error);
    return Response.json({ error: "Échec de la qualification. Veuillez réessayer." }, { status: 500 });
  }
}
