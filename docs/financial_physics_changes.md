# Financial Physics Protocol — Update Log

Timestamp: 2026-01-16 14:33:25 +06

## Recent Updates
- `npm run typecheck` passes in `smb-coaching-ai`.
- Removed unused imports in `src/components/diagnostic/DiagnosticFlow.tsx` and `src/components/diagnostic/EngagementFitCheck.tsx`.
- Working branch: `feature/high-ticket-os` (uncommitted changes present).

## Global Mode + Scenario Visibility
- Added centralized scenario/advisory logic in `src/lib/physicsState.ts`.
- Mounted global indicators in `src/App.tsx` via `ModeIndicator` and `ScenarioBanner`.
- Added scenario banner UI in `src/components/diagnostic/ScenarioBanner.tsx`.

## Phase 0 — Engagement Fit
- Persisted simulation state + physics flags in `src/components/diagnostic/EngagementFitScreen.tsx`.
- Mirrored state/flags for legacy gate in `src/components/diagnostic/EngagementFitCheck.tsx`.

## Simulation Mode Lockdown
- Router-level advisory blocking in `src/components/diagnostic/DiagnosticFlow.tsx` using `AdvisoryBlockedScreen`.
- Blocking screen added: `src/components/diagnostic/AdvisoryBlockedScreen.tsx`.
- Plan generation guard in `src/lib/PlanGenerator.ts`.
- Coach API guard in `src/lib/coachApi.ts`.
- Bottleneck engine guard in `src/lib/BottleneckEngine.ts`.
- Commitment gate blocked in `src/components/diagnostic/CommitmentGate.tsx`.

## Phase 1 — Revenue Physics + Offer Traceability
- Added primary offer/assumption enforcement + sources in `src/components/diagnostic/RevenueGoalScreen.tsx`.
- Revenue goal now stores offer ID and sources in `src/store/useBusinessStore.ts`.
- Recap uses primary/assumed offer data in `src/components/diagnostic/DataRecapScreen.tsx`.

## Phase 2 — Unit Economics Wiring
- Corrected contribution margin reporting in `src/lib/UnitEconomicsEngine.ts`.
- Full underwriting thresholds wired and stored in `src/components/diagnostic/CACPaybackScreen.tsx`.

## Protocol Checklist
- Added rule-to-code checklist in `docs/financial_physics_protocol_checklist.md`.
