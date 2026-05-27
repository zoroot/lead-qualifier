# AI Lead Qualifier — FULLSTACK

## WAT Framework

This project is organized using the **WAT framework**:

| Letter | Role | Location |
|--------|------|----------|
| **W** | Workflows / instructions | `workflows/` |
| **A** | Agent (Claude Code) | *(you — no folder)* |
| **T** | Tools / utility scripts | `tools/` |

---

## Project Overview

An AI-powered lead qualification tool. The user fills out a form about a sales lead, clicks **Analyze**, and receives a structured AI assessment: a score (0–100), a tier (Hot / Warm / Cold), and a written reasoning.

**Flow:**
```
Frontend Form (Next.js / Vercel)
  → POST /api/qualify
  → Trigger.dev task: "qualify-lead"
  → Claude API (claude-sonnet-4-6)
  → { score, tier, reasoning }
  → Displayed in frontend
```

---

## Tech Stack

| Layer | Technology | Package |
|-------|-----------|---------|
| Backend orchestration | Trigger.dev v3 (cloud) | `@trigger.dev/sdk` |
| AI model | Claude (Anthropic) | `@anthropic-ai/sdk` |
| Frontend | Next.js 14+ (App Router) | `next` |
| Frontend deploy | Vercel via GitHub | — |
| Language | TypeScript (strict) | `typescript` |

---

## Folder Structure

```
Lead Qualifier - FULLSTACK/
├── CLAUDE.md                              # This file
├── package.json                           # Trigger.dev worker root package
├── tsconfig.json                          # TypeScript config (covers workflows/ + tools/)
├── trigger.config.ts                      # Trigger.dev project config
│
├── workflows/                             # W — Trigger.dev tasks + AI instructions
│   ├── tasks/
│   │   └── qualify-lead.ts               # Main task: calls Claude, returns result
│   └── instructions/
│       └── qualifier-prompt.ts           # System prompt / scoring rubric (exported string)
│
├── tools/                                 # T — Shared utilities
│   ├── types.ts                           # LeadInput + QualificationResult interfaces
│   ├── scoring.ts                         # score → tier mapping
│   └── validators.ts                      # Input validation
│
└── frontend/                              # Next.js app (Vercel)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                   # Lead intake form
    │   │   └── api/qualify/route.ts       # API route → trigger.dev trigger
    │   ├── components/
    │   │   ├── LeadForm.tsx
    │   │   └── QualificationResult.tsx
    │   └── lib/
    │       └── trigger-client.ts          # Trigger.dev SDK wrapper
    ├── package.json
    └── vercel.json
```

---

## Lead Input Fields

Defined in `tools/types.ts` as `LeadInput`:

| Field | Type | Notes |
|-------|------|-------|
| `companyName` | `string` | Required |
| `contactName` | `string` | Required |
| `email` | `string` | Required |
| `role` | `string` | e.g. "CTO", "Marketing Manager" |
| `companySize` | enum | `"1-10" \| "11-50" \| "51-200" \| "201-1000" \| "1000+"` |
| `budget` | enum | `"<$1k" \| "$1k-$10k" \| "$10k-$50k" \| "$50k+"` |
| `timeline` | enum | `"Immediate" \| "1-3 months" \| "3-6 months" \| "6+ months"` |
| `useCase` | `string` | Free text — what the lead wants to accomplish |
| `additionalNotes` | `string?` | Optional context |

---

## Output Contract

Defined in `tools/types.ts` as `QualificationResult`:

```typescript
{
  score: number;        // 0–100
  tier: "Hot" | "Warm" | "Cold";   // ≥70 Hot, ≥40 Warm, <40 Cold
  reasoning: string;   // AI-written paragraph explaining the score
}
```

---

## Environment Variables

### Trigger.dev worker (`.env` at project root)
```
ANTHROPIC_API_KEY=sk-ant-...
TRIGGER_SECRET_KEY=tr_dev_...
```

### Frontend (Vercel environment variables)
```
TRIGGER_SECRET_KEY=tr_...         # Same secret — used by /api/qualify route
NEXT_PUBLIC_APP_URL=https://...   # Your Vercel deployment URL
```

---

## Key Conventions

- All TypeScript — strict mode on
- Shared types live in `tools/types.ts` — never duplicate
- The AI system prompt lives in `workflows/instructions/qualifier-prompt.ts` (exported `const`)
- Score → tier conversion always goes through `tools/scoring.ts`
- The frontend API route calls trigger.dev with `triggerAndPoll` (waits for result synchronously)

---

## Build Order (for Claude Code)

1. `tools/types.ts` — define shared interfaces first
2. `tools/scoring.ts` + `tools/validators.ts` — utilities
3. `workflows/instructions/qualifier-prompt.ts` — system prompt
4. `workflows/tasks/qualify-lead.ts` — main trigger.dev task
5. `trigger.config.ts` + `package.json` + `tsconfig.json` — root config
6. `frontend/` — scaffold Next.js app, build form + result components
7. `frontend/src/app/api/qualify/route.ts` — bridge to trigger.dev
8. Deploy backend to Trigger.dev cloud
9. Deploy frontend to Vercel via GitHub

---

## Deployment

### Backend (Trigger.dev)
```bash
# From project root
npx trigger.dev@latest login
npx trigger.dev@latest deploy
```
Set `ANTHROPIC_API_KEY` in your Trigger.dev project's environment variables (dashboard → Project → Environment Variables).

### Frontend (Vercel)
Push `frontend/` to GitHub → connect repo in Vercel → set `TRIGGER_SECRET_KEY` and `NEXT_PUBLIC_APP_URL` in Vercel environment variables → deploy.
