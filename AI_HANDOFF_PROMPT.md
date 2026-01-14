# AI Handoff: Consulting OS (High-Ticket)

**Last Updated**: 2026-01-15
**Project**: smb-coaching-ai (Consulting Operating System)
**Status**: Phase 2 Complete, Ready for Phase 3

---

## Quick Resume Command

```bash
cd "/Users/md.rashedmamun/Claude Code Projects/Antigravity Venture Studio/smb-coaching-ai"
npm install
npm run dev
```

---

## Project Context

This is a **High-Ticket Consulting Operating System**, not a coaching app.

**Core Paradigm**:
- Revenue-First, Data-Driven advisory
- "Consulting Lab" for builders (vs rejection)
- ICP-Aware prescriptions (Authority, Cycle, Risk)

---

## Architecture Summary

### 1. Engagement Fit Check (The Velvet Rope)
- **File**: `src/components/diagnostic/EngagementFitCheck.tsx`
- **Logic**: `src/lib/OutcomeGateScoring.ts`
- **Rule**: Pass if `Price >= $3k` OR (`Consultative` AND `B2B Buyer`)
- **Outcomes**: "Consulting OS" (full access) or "Consulting Lab" (sandbox)

### 2. High-Ticket Intake
- **File**: `src/components/diagnostic/HighTicketIntake.tsx`
- **Schema**: `HighTicketICP` on `Offer.highTicketICP`
- **Fields**: `decisionAuthority`, `salesCycle`, `riskTolerance`

### 3. Strategic Brief Generator
- **File**: `src/lib/StrategicBriefGenerator.ts`
- **Output**: One-Page Consulting Memo (Markdown)
- **Sections**: Executive Summary, Market Physics, Prescription, Risk Audit

### 4. ICP-Aware Engines
- **BottleneckEngine.ts**: Dynamic benchmarks (8% for Enterprise, 15% for fast cycles)
- **PlanGenerator.ts**: Extended interface for ICP injection

---

## Flow Order

```
Strategic Fork
  → Revenue Goal (Vision)
    → Engagement Fit Check (Reality Check)
      → [PASS] Offer Inventory → High-Ticket Intake → Offer Health Check → ...
      → [FAIL] Offer Inventory (Consulting Lab Mode) → ...
```

---

## Completed Tasks

### Phase 1: Infrastructure ✅
- [x] Engagement Fit Check with "Selection" psychology
- [x] High-Ticket Intake (per-offer ICP)
- [x] Simulation Mode → Consulting Lab rebrand
- [x] `isSimulationMode` state tracking

### Phase 2: Advisory Intelligence ✅
- [x] Context-Aware Gate (OR logic for B2B)
- [x] Strategic Brief Generator
- [x] ICP-Aware BottleneckEngine (dynamic benchmarks)
- [x] Extended PlanGenerator interface

---

## Pending Tasks

### Phase 3: Tone & Integration
- [ ] Tone Audit for `coachApi.ts` ("Consulting Partner" voice)
- [ ] Build UI component to render Strategic Brief
- [ ] Wire Strategic Brief into the Verdict/Dashboard flow

---

## Key Files to Review

| File | Purpose |
|------|---------|
| `src/lib/OutcomeGateScoring.ts` | Gate logic |
| `src/lib/StrategicBriefGenerator.ts` | Memo generator |
| `src/lib/BottleneckEngine.ts` | Core diagnosis |
| `src/lib/PlanGenerator.ts` | Plan generation |
| `src/store/useBusinessStore.ts` | State (includes `HighTicketICP`) |
| `src/components/diagnostic/DiagnosticFlow.tsx` | Flow orchestration |

---

## Artifacts (Planning Docs)

Located in: `~/.gemini/antigravity/brain/7443bb27-2a46-49c6-bda9-3ac8f9f56d6f/`

- `task.md` - Current checklist
- `implementation_plan.md` - Technical spec
- `walkthrough.md` - What was built and why
- `ICP_Findings_Report.md` - Research on High-Ticket archetypes

---

## How to Resume in a New IDE

1. **Open the project folder**: `/Users/md.rashedmamun/Claude Code Projects/Antigravity Venture Studio/smb-coaching-ai`

2. **Paste this to the AI**:
   > "Read the file `/Users/md.rashedmamun/Claude Code Projects/Antigravity Venture Studio/smb-coaching-ai/AI_HANDOFF_PROMPT.md`. Resume from where we left off."

3. **Confirm Git status**:
   ```bash
   git log -3 --oneline
   ```

---

## Design Principles (Non-Negotiable)

1. **No Coaching Fluff**: This is a consulting platform, not a motivational app.
2. **Revenue-First**: Goal always comes before diagnostics.
3. **Offer-Scoped ICP**: Each offer can have different buyer physics.
4. **Consulting Lab, Not Rejection**: Unqualified users are in an incubator, not blocked.
5. **Data Integrity**: Simulation Mode never pollutes the advisory feedback loop.

---

*End of Handoff Document*
