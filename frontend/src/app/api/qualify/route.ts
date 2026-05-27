import { configure, tasks, runs } from "@trigger.dev/sdk";
import type { LeadInput } from "@/lib/types";

configure({ secretKey: process.env.TRIGGER_SECRET_KEY! });

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const payload: LeadInput = await request.json();

    const { id } = await tasks.trigger("qualify-lead", payload);
    const run = await runs.poll(id, { pollIntervalMs: 1500 });

    return Response.json(run.output);
  } catch (error) {
    console.error("Qualify error:", error);
    return Response.json({ error: "Failed to qualify lead. Please try again." }, { status: 500 });
  }
}
