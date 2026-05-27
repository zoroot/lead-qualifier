import { task } from "@trigger.dev/sdk";
import Anthropic from "@anthropic-ai/sdk";
import type { LeadInput, QualificationResult, CriterionScore } from "../../tools/types";
import { scoreToTier } from "../../tools/scoring";
import { validateLeadInput } from "../../tools/validators";
import { SYSTEM_PROMPT } from "../instructions/qualifier-prompt";

const anthropic = new Anthropic();

export const qualifyLead = task({
  id: "qualify-lead",
  maxDuration: 60,

  run: async (payload: LeadInput): Promise<QualificationResult> => {
    validateLeadInput(payload);

    const leadSummary = `
Entreprise : ${payload.companyName}
Contact : ${payload.contactName} (${payload.role})
Email : ${payload.email}
Taille de l'entreprise : ${payload.companySize} employés
Budget : ${payload.budget}
Horizon temporel : ${payload.timeline}
Cas d'usage : ${payload.useCase}
Notes complémentaires : ${payload.additionalNotes || "Aucune"}
    `.trim();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Qualifie le prospect suivant :\n\n${leadSummary}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("La réponse IA ne contient pas de JSON valide");
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      score: number;
      reasoning: string;
      breakdown: CriterionScore[];
      nextSteps: string[];
    };

    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score))));

    return {
      score,
      tier: scoreToTier(score),
      reasoning: parsed.reasoning,
      breakdown: parsed.breakdown ?? [],
      nextSteps: parsed.nextSteps ?? [],
    };
  },
});
