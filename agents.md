# Agent Learnings & Patterns

> **Purpose:** Capture patterns, discoveries, and best practices from each development iteration so future iterations can learn from past work.
> **Last Updated:** 2026-01-09

---

## Pattern Library

### 1. Stage-Gated Logic Pattern
**Discovery:** Advice must be *opposite* depending on the user's lifecycle stage.

| Pattern | Stage 0 | Stage 1+ |
|---------|---------|----------|
| Pricing | $0 = CORRECT | $0 = WRONG |
| Audience | Vague = OK (they don't know yet) | Vague = FAIL |
| Goal | Find 5 free users | Charge premium |

**Implementation:**
```javascript
// Stage 0 gets different base score
let score = stage === 'Improvise' ? 60 : 0;

// Stage 0 pricing logic is INVERTED
if (stage === 'Improvise') {
    if (price === 0) score += 40; // Free is CORRECT
}
```

---

### 2. Mock-First Testing Pattern
**Discovery:** Use mock mode in components to test full logic paths without backend dependency.

**Implementation:**
- Inject mock logic that simulates the full Edge Function
- Enable via a flag or environment variable
- Run automated scenarios through browser_subagent

**Benefits:**
- No API costs during testing
- Faster iteration cycles
- Deterministic test results

---

### 3. Persona-Based Scenario Testing
**Discovery:** Real transcripts provide the best test cases. Abstract user types into testable scenarios.

**Tested Personas:**
| Persona | Revenue | Key Trait | Expected Outcome |
|---------|---------|-----------|------------------|
| The Garbage Man | $1.2M | Vague headline | Low Score |
| The Stylist | $80k | Generic audience | Low Score |
| The Techie | $150k | Specific numbers | High Score |
| The Dreamer | $0 | Pre-revenue | High Score (Stage 0 special) |

---

### 4. Clarity Scoring Heuristics
**Discovery:** Simple regex patterns effectively detect offer quality.

```javascript
// Numbers indicate specificity (GOOD)
/\d+\s*(days?|weeks?|months?|lbs?|kg|k|\$|%)/.test(headline)

// Jargon indicates vagueness (BAD)
/holistic|synergy|comprehensive|solutions|empowering/.test(headline)
```

---

### 5. The Grandmother Test
**Discovery:** From transcripts — if your grandmother can't understand who you help, the offer is too vague.

**Implementation:** 
- Check audience string length > 10 characters
- Reject "everyone", "anybody", "people"
- Award bonus for narrow specificity

---

### 6. State Settlement Time
**Discovery:** UI agents (browser_subagent) move faster than React state updates. Rapid navigation causes transient data loss or "empty state" errors.

**Policy:**
- Include mandatory **500ms pauses** between critical state transitions (e.g., clicking 'Next' after a large form submission).
- Always verify "Settled State" (e.g., checking for a specific ID like `results-loaded`) before taking the next action.

---

### 7. Methodology Bifurcation (The Strategic Fork)
**Discovery:** Not every user is a fit for the "High-Ticket" diagnostic engine. Forcing them through it results in irrelevant advice.

**Implementation:**
- **The Qualifying Question:** Start every intake with a business model check.
- **Track A (High-Ticket):** Proceed to core diagnostic engine.
- **Track B (Commodity/Other):** Exit to specialized waitlist/roadmap.
- **Benefit:** Protects the integrity of the core logic and prevents "hallucinated advice" for bad-fit businesses.

---

### 8. Qualitative AI Guardrails
**Discovery:** LLMs are prone to "Generic Encouragement." To make them "Brutally Honest Coaches," they need deterministic anchors.

**Implementation:**
- **Deterministic Truth Injection:** Pass the results of the `funnel_taxonomy` (Hard Rules) into the LLM prompt as "Fact."
- **Constraint:** "If the score is < 60, you MUST use the label 'Invisible' and you MAY NOT use positive adjectives about the headline."
- **Result:** The AI's qualitative critique is anchored to the quantitative math.

---

## 🏷️ Standardized Terminology (De-branding)

To maintain our proprietary brand identity, always use these terms:

| Legacy Term | New Proprietary Term |
|-------------|----------------------|
| Alex / Hormozi | **Antigravity** / **Strategic-Coach** |
| Grand Slam Offer | **Winning Offer** |
| Marriage on First Date | **High-Friction Gap** |
| Value Equation | **Potential Multiplier** |

---

## Anti-Patterns Discovered

### ❌ Universal Scoring
**Problem:** Applying same rules to all stages penalizes Stage 0 users unfairly.
**Solution:** Always check `stage` before scoring.

### ❌ Backend-First Testing
**Problem:** Requires live Edge Functions, incurs costs, adds latency.
**Solution:** Mock mode for dev/test, real backend for production.

### ❌ Generic AI Advice
**Problem:** AI saying "Great job!" to a failing business.
**Solution:** Inject deterministic scores into the prompt and forbid positive adjectives for low scores.

---

## Iteration Checklist (Template)

For each new feature:
1. [ ] Define Logic (Write AC in Markdown)
2. [ ] Implement Backend (Create/update Edge Function if required)
3. [ ] Wire Frontend (Connect Form -> Backend -> Result)
4. [ ] Enable Mock Mode (For testing without backend)
5. [ ] Define 3-5 Test Scenarios (Based on real personas)
6. [ ] Run Automated Tests (browser_subagent)
7. [ ] Update PRD (Reflect changes in both Tech & Non-Tech PRD)
8. [ ] Update this file (Document new patterns)

---

## Files Referenced

- [Universal Logic Map](file:///Users/md.rashedmamun/Claude Code Projects/SMB Coaching AI/docs/universal_logic_map.md) — Source of truth for scoring rules
- [Acceptance Criteria](file:///Users/md.rashedmamun/Claude Code Projects/SMB Coaching AI/docs/acceptance_criteria.md) — Test cases
- [Test Scenarios](file:///Users/md.rashedmamun/Claude Code Projects/SMB Coaching AI/docs/test_scenarios.md) — Persona definitions
