# Phase 1 Mission Control Implementation Plan

Timestamp: 2026-01-16 16:22:00 +06

## Objective
Ship Phase 1 Revenue Physics with deterministic outputs, zero silent defaults, and a minimal "Mission Control" theme. The user must finish Phase 1 and receive a Growth Physics Brief that is auditable and reproducible.

## Non-Negotiables
- No placeholder numbers presented as fact.
- No "using your offer" copy unless `primaryOfferId` exists.
- No blended metrics across offers in Phase 1.
- No calls/leads per month unless close rate exists or is explicitly assumed.
- No margin shown unless delivery cost is explicitly entered.
- No late branching; selling status is asked immediately after Fork.
- Scenario Mode is only true when assumptions are explicitly used.

## Journey Order (Phase 1 Flow)
1) Fork (High-ticket services)
2) Starting Line: "Are you currently selling this already?" (Yes / Not yet)
3) Phase Map strip (Mission Control)
4) Revenue Goal (90-day monthly target)
5) If selling: Current revenue (avg last 3 months)
6) Offer Portfolio (multi-offer capture)
7) Primary Offer Selection (required)
8) Growth Physics Brief (Phase 1 output)

## Phase Map Requirements
Phase Map must be a lightweight strip (not a full screen) and must clearly state:
- Phase 1 Output: "Growth Physics Brief: gap + deals needed"
- Required inputs count (example: "5 mins, 2-6 fields")
- "No assumptions unless you toggle them"

If it cannot convey these, remove the Phase Map.

## Data Model Updates (Schema Diff)
BusinessContext additions/changes:
- `sellingStatus: 'selling' | 'pre_revenue'`
- `currentRevenueMonthlyAvg: number | null`
- `targetRevenueMonthly: number`
- `phase1: { status: 'incomplete' | 'complete'; mode: 'real' | 'scenario'; assumptionsUsed: string[] }`
- `growthPhysicsBrief: { revenueGapMonthly: number; requiredDealsMonthly?: number; assumptionsUsed: string[]; mode: 'real' | 'scenario' }`
- Deprecate `isPreRevenue` in favor of `sellingStatus`

Offer schema minimum:
- `price: number`
- `billingModel: 'one_off' | 'monthly_retainer' | 'annual_retainer' | 'usage' | 'other'`
- `isActiveNow: boolean`
- `billingPeriod?: 'monthly' | 'annual'` (required when billingModel is monthly_retainer or annual_retainer; otherwise must be null/undefined)
- `dealsPerMonth?: number` (optional; used only if selling)
- `deliveryCost?: number`
- `deliveryCostEntered: boolean`

## Single Source of Truth: GrowthPhysicsBrief Builder
Create `src/lib/GrowthPhysics.ts` with a single deterministic function:
- Inputs: targetRevenueMonthly, currentRevenueMonthlyAvg, primaryOfferId, primaryOfferPrice, closeRate (if available), assumptions toggles
- Output: GrowthPhysicsBrief { revenueGapMonthly, requiredDealsMonthly?, assumptionsUsed, mode }
Rules:
- revenueGapMonthly = max(target - current, 0)
- requiredDealsMonthly only if primaryOfferId exists
- capacity (calls/leads) only if close rate is provided or explicitly assumed
- assumptionsUsed empty unless user explicitly toggles assumptions
- mode = 'scenario' only when assumptionsUsed is non-empty
- if sellingStatus is `selling` and currentRevenueMonthlyAvg is null -> status is `incomplete`
- if targetRevenueMonthly is missing or 0 -> block progression
- phase1.status = complete when targetRevenueMonthly > 0 AND sellingStatus is set
- growthPhysicsBrief.requiredDealsMonthly remains undefined until primaryOfferId exists

## UI Behavior Rules (Phase 1)
- If no primary offer: show revenue gap only; lock "Deals required" card with text "Select primary offer to compute deals."
- If delivery cost is empty/0 and not explicitly entered: do not show margin; show "Enter delivery cost to compute margin."
- If close rate missing: do not show calls/leads; require explicit assumption to unlock.
- All Phase 1 outputs render from GrowthPhysicsBrief; no duplicate math in screens.
- Revenue Goal screen includes copy: "Next, we'll capture your offers and pick your primary offer to calculate deals."

## File-Level Changes (Planned)
- `src/components/diagnostic/DiagnosticFlow.tsx`
  - Move selling status immediately after Fork.
  - Insert Phase Map strip before Revenue Goal.
  - Ensure flow follows: Selling Status -> Phase Map -> Revenue Goal -> Current Revenue (if selling) -> Offer Portfolio -> Primary -> Brief.
- `src/components/diagnostic/OfferPortfolioScreen.tsx`
  - Hide margin until cost explicitly entered.
  - Capture billingModel, billingPeriod (retainer), isActiveNow, optional dealsPerMonth.
- `src/components/diagnostic/RevenueGoalScreen.tsx`
  - Stop "Deals required" unless primaryOfferId exists.
  - Show gap only when no primary offer.
  - Add explicit copy about primary offer being collected next.
- `src/components/diagnostic/PrimaryOfferSelectionScreen.tsx`
  - Mandatory selection before moving to Growth Physics Brief.
- `src/components/diagnostic/GrowthPhysicsBrief.tsx` (new) or update `DataRecapScreen.tsx`
  - Render output strictly from GrowthPhysicsBrief object.
- `src/components/diagnostic/EngagementFitCheck.tsx`
  - Replace `document.querySelector('input')` with controlled input state.
- `src/store/useBusinessStore.ts`
  - Add sellingStatus, currentRevenueMonthlyAvg, targetRevenueMonthly, phase1, growthPhysicsBrief.
- `src/lib/GrowthPhysics.ts` (new)
  - Deterministic builder for gap/deals/assumptions.

## Verification Checklist (Personas)
Persona A (Selling, primary set, real)
- Inputs: selling, current=10k, target=50k, primary=5k
- Expect: gap=40k, deals=8, mode=real, assumptionsUsed=[]

Persona B (Pre-revenue, no offers)
- Inputs: pre_revenue, target=30k, no offers
- Expect: gap shown, deals locked, status=complete, mode=real, assumptionsUsed=[]

Persona C (Selling, primary set, close rate missing)
- Inputs: selling, current=15k, target=45k, primary=3k, close rate missing
- Expect: gap + deals only; no calls/leads unless close rate explicitly assumed

Persona D (Multi-offer primary switch)
- Offers: 3k, 8k, 15k
- Primary = 3k -> deals change
- Switch primary to 15k -> deals change
- Gap remains identical

## Deliverables Before Coding Screens
1) Updated Phase 1 state model with `status: incomplete/complete` and mode only when assumptions used
2) Final Offer schema with billingModel + isActiveNow
3) GrowthPhysicsBrief builder spec (single math engine)
4) Verification checklist updated with Persona D
