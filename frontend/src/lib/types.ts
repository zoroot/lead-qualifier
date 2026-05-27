export interface LeadInput {
  companyName: string;
  contactName: string;
  email: string;
  role: string;
  companySize: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+";
  budget: "<$1k" | "$1k-$10k" | "$10k-$50k" | "$50k+";
  timeline: "Immediate" | "1-3 months" | "3-6 months" | "6+ months";
  useCase: string;
  additionalNotes?: string;
}

export interface CriterionScore {
  criterion: string;
  weight: number;
  score: number;
  explanation: string;
}

export interface QualificationResult {
  score: number;
  tier: "Hot" | "Warm" | "Cold";
  reasoning: string;
  breakdown: CriterionScore[];
  nextSteps: string[];
}
