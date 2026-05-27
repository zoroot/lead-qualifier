import type { QualificationResult } from "./types";

// ≥70 → Hot, ≥40 → Warm, <40 → Cold
export function scoreToTier(score: number): QualificationResult["tier"] {
  if (score >= 70) return "Hot";
  if (score >= 40) return "Warm";
  return "Cold";
}
