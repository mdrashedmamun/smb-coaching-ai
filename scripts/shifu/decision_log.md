# Strategic Decision Log

> A running log of key debates, disagreements, and resolutions.
> Format: Date → Topic → Debate Summary → Resolution → Open Questions

---

## 2026-01-12: Business Model & Pricing Strategy

### Topic
How to price the product for founders, incubators, and governments.

### The Debate

**Initial Claim (External Reviewer):**
- Founders: $200-500/mo subscription
- Incubators: $50-100/startup
- Governments: $50-200/business annually
- 90%+ contribution margin
- "Daily loop = high retention"

**Pushback (Internal):**
1. **$200-500/mo is Day 365 pricing, not Day 1.** Founders don't pay aspirational prices for unproven tools.
2. **Incubators want free.** They expect "partnerships," not invoices. Selling TO them is slow; selling THROUGH them is smarter.
3. **Government is Year 3.** Procurement cycles are 6-18 months. Not a lean startup customer.
4. **Daily loop is a double-edged sword.** If check-in feels pointless, it's a churn accelerant, not retention.
5. **90% margin ignores LLM compute.** More realistic: 70-80%.

### Resolution

**Agreed Pricing Sequence:**

| Tier | Price | Purpose |
|---|---|---|
| Free or $9 | One-time | Intake + Enriched Diagnosis (wedge) |
| Starter | $29/mo | 1 Module + Daily Loop (validate stickiness) |
| Pro | $99/mo | All Modules + Behavioral Report (prove evidence value) |
| Institutional | Custom | Only after 50-100 Pro users |

**Key Principles Locked:**
- **Anchor to the first mile, not the destination.**
- **Daily loop must be <5 seconds and give recognition, not ask for input.**
- **Moat in Year 1 is psychological (shame/accountability), not data.**

### Open Questions
- Should the wedge be $0 (free) or $9 (filter for serious founders)?
- What's the minimum viable daily loop interaction?

---

## 2026-01-12: Enriched Diagnostic Output

### Topic
How to close the credibility gap between intake and output.

### The Debate

**Problem:**
- Intake asks hard, specific questions (operationalChange, structuralFix, constraintMetadata).
- Output was generic, template-based language.
- Founders felt "unseen."

**Solution Proposed:**
- Pass founder's own words into the diagnostic output.
- Constraint explanation: "You mentioned: '[their evidence]'"
- Lever rationale: "You said you're avoiding '[their structural fix]'."
- Module intro: "Based on your [constraint] and your admission that you're avoiding X, start with [module]."

### Resolution

**Implemented.** See commit `57f6522`.

**Files Changed:**
- `business_axes.ts`: Added `statedChange`, `admittedFix`, `constraintEvidence` to `DiagnosticOutput`.
- `scoring_engine.ts`: Passes founder context (for explanation, not scoring).
- `DiagnosticDashboard.tsx`: Builds enriched rationale using founder's words.
- `App.tsx`: Adds contextual intro above module grid.

**Key Principle Locked:**
> Context informs *how we explain*, not *what we conclude*. Scoring remains cold.

### Open Questions
- None. This is shipped.

---

## 2026-01-12: Strategy Briefing Structure

### Topic
How to structure the core strategy document (`strategy_briefing.md`).

### The Debate

**Initial Critique (External):**
1. "Behavioral Ledger" principle was buried at the end. Should be elevated.
2. Missing explicit "enemy" (behavioral failure modes).
3. "Boring SMBs" needs a grounding sentence.
4. Underwriting connection is abstract.

### Resolution

**Implemented.** Updated `strategy_briefing.md`:
- **Behavioral Ledger** is now Strategic Principle #1 (philosophy).
- **Irreversibility** is Mechanism A.
- **Daily Reliance** is Mechanism B.
- Added "What breaks these businesses" section (verbal delegation, invisible regression, tool sprawl, advice without memory).
- Added "Boring = revenue earned through repeated human execution, not scale myths."
- Added concrete underwriting connection box.

### Open Questions
- Should we add a "What We Refuse to Become" section?

---

## Template for Future Entries

```markdown
## YYYY-MM-DD: [Topic Title]

### Topic
One-line description of what was debated.

### The Debate
- **Claim A:** [Position 1]
- **Claim B:** [Position 2]
- **Disagreement:** [Where we didn't align]

### Resolution
What we decided. What was implemented.

### Open Questions
What's still unresolved.
```

