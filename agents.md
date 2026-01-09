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

## Anti-Patterns Discovered

### ❌ Universal Scoring
**Problem:** Applying same rules to all stages penalizes Stage 0 users unfairly.
**Solution:** Always check `stage` before scoring.

### ❌ Backend-First Testing
**Problem:** Requires live Edge Functions, incurs costs, adds latency.
**Solution:** Mock mode for dev/test, real backend for production.

### ❌ Single Global Score
**Problem:** A score without context is meaningless.
**Solution:** Always pair score with stage label and stage-appropriate critique.

---

## Iteration Checklist (Template)

For each new feature:
1. [ ] Define Logic (Write AC in Markdown)
2. [ ] Implement Backend (Create/update Edge Function if Amp required)
3. [ ] Wire Frontend (Connect Form -> Backend -> Result)
4. [ ] Enable Mock Mode (For testing without backend)
5. [ ] Define 3-5 Test Scenarios (Based on real personas)
6. [ ] Run Automated Tests (browser_subagent)
7. [ ] Update PRD (Reflect changes in both Tech & Non-Tech PRD)
8. [ ] Update this file (Document new patterns)

---

## Files Referenced

- [Universal Logic Map](file:///Users/md.rashedmamun/.gemini/antigravity/brain/49f322ea-9197-47f8-8070-70aa4e3beecd/universal_logic_map.md) — Source of truth for scoring rules
- [Acceptance Criteria](file:///Users/md.rashedmamun/.gemini/antigravity/brain/49f322ea-9197-47f8-8070-70aa4e3beecd/acceptance_criteria.md) — Test cases
- [Test Scenarios](file:///Users/md.rashedmamun/.gemini/antigravity/brain/49f322ea-9197-47f8-8070-70aa4e3beecd/test_scenarios.md) — Persona definitions
