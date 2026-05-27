import type { LeadInput } from "./types";

export function validateLeadInput(lead: LeadInput): void {
  const required: (keyof LeadInput)[] = [
    "companyName",
    "contactName",
    "email",
    "role",
    "useCase",
  ];

  for (const field of required) {
    const value = lead[field];
    if (!value || (typeof value === "string" && !value.trim())) {
      throw new Error(`${field} is required`);
    }
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(lead.email)) {
    throw new Error("email is invalid");
  }
}
