import { task } from "@trigger.dev/sdk";
import Anthropic from "@anthropic-ai/sdk";
import type { LeadInput, QualificationResult } from "../../tools/types";
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
Company: ${payload.companyName}
Contact: ${payload.contactName} (${payload.role})
Email: ${payload.email}
Company Size: ${payload.companySize} employees
Budget: ${payload.budget}
Timeline: ${payload.timeline}
Use Case: ${payload.useCase}
Additional Notes: ${payload.additionalNotes || "None"}
    `.trim();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please qualify the following lead:\n\n${leadSummary}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]) as { score: number; reasoning: string };
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score))));

    return {
      score,
      tier: scoreToTier(score),
      reasoning: parsed.reasoning,
    };
  },
});
