# Financial Physics Protocol Checklist (Code Map)

## Phase 0 — Engagement Fit (Mode + Gate)
- Engagement Fit gate writes `operatingMode`, `isSimulationMode`, `physicsFlags.phase0` in `src/components/diagnostic/EngagementFitScreen.tsx`.
- Legacy engagement gate mirrors state + flags in `src/components/diagnostic/EngagementFitCheck.tsx`.
- Global visibility: `ModeIndicator` + `ScenarioBanner` mounted in `src/App.tsx`.

## Phase 1 — Revenue Physics (Primary Offer Isolation)
- Primary offer/assumption enforcement + traceability stored in `src/components/diagnostic/RevenueGoalScreen.tsx`.
- Revenue goal data includes `primaryOfferId`, offer price, rate sources in `src/store/useBusinessStore.ts`.
- Output recap uses goal + primary offer, not blended offers, in `src/components/diagnostic/DataRecapScreen.tsx`.

## Phase 2 — Unit Economics & Fundability
- Full underwriting thresholds computed in `src/lib/UnitEconomicsEngine.ts`.
- CAC + unit economics wiring with contribution margin percent in `src/components/diagnostic/CACPaybackScreen.tsx`.
- Phase 2 status + blockers stored via `physicsFlags.phase2` in `src/components/diagnostic/CACPaybackScreen.tsx`.

## Scenario & Estimates Labeling (Single Source of Truth)
- Assumptions captured in `context.assumptions` via `setAssumptionField` in `src/store/useBusinessStore.ts`.
- Scenario banner derives from `assumptions` + `physicsFlags` in `src/components/diagnostic/ScenarioBanner.tsx` using `src/lib/physicsState.ts`.

## Simulation Mode Lockdown (Router + Service)
- Advisory block logic centralized in `src/lib/physicsState.ts` (`getAdvisoryBlockState`).
- Router-level blocking for advisory steps in `src/components/diagnostic/DiagnosticFlow.tsx` (via `AdvisoryBlockedScreen`).
- Service-level guards:
  - Plan generator: `src/lib/PlanGenerator.ts`
  - Coach API: `src/lib/coachApi.ts`
  - Bottleneck engine: `src/lib/BottleneckEngine.ts`
- Commit trigger blocked in `src/components/diagnostic/CommitmentGate.tsx`.
