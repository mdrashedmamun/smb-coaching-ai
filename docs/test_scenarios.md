# Test Scenarios: Real User Personas

> **Source:** 8-Transcript Analysis (Investor Consultations)
> **Purpose:** Automated verification of Stage Logic and Offer Diagnostic.

---

## Scenario 1: "The Garbage Man" (Transcript 01)
**Profile:** Established service business, high revenue, low margin.

| Field | Value |
|---|---|
| Business Name | Waste Solutions LLC |
| Business Type | Service (Local) |
| Revenue | $1,200,000 |
| Profit | $120,000 |
| 1-Year Goal | $2,000,000 |
| Constraint | Leads |
| Offer Headline | "We haul your trash" |
| Price | $50/month |
| Audience | "Homeowners" |

**Expected:**
- Stage: `Monetize` (or Scale)
- Advice Type: "Sales Director" — Raise prices (Low price for service business).
- Flag: Margin is 10% — borderline "Charity Mode".

---

## Scenario 2: "The Stylist" (Transcript 02)
**Profile:** Personal styling business, commission-based, unclear offer.

| Field | Value |
|---|---|
| Business Name | Style by Sarah |
| Business Type | Service (Local) |
| Revenue | $80,000 |
| Profit | $30,000 |
| 1-Year Goal | $200,000 |
| Constraint | Sales |
| Offer Headline | "I help people look good" |
| Price | $200 |
| Audience | "Women" |

**Expected:**
- Stage: `Monetize`
- Advice Type: "Sales Director" — Offer is vague ("look good" is not specific).
- Score: Low (Clarity issue).

---

## Scenario 3: "The Chiropractor" (Transcript 03)
**Profile:** Multi-location health practice, high ticket, scaling.

| Field | Value |
|---|---|
| Business Name | Spine Solutions |
| Business Type | Service (Local) |
| Revenue | $5,200,000 |
| Profit | $1,200,000 |
| 1-Year Goal | $10,000,000 |
| Constraint | Leads |
| Offer Headline | "Custom treatment plans for lasting pain relief in 90 days" |
| Price | $3,000 |
| Audience | "Men and women 35-65 with chronic back pain" |

**Expected:**
- Stage: `Scale`
- Advice Type: "Private Equity Analyst" — Focus on ops/efficiency.
- Score: High (Strong offer, good pricing, specific avatar).

---

## Scenario 4: "The Trophy Maker" (Transcript 04)
**Profile:** E-commerce, low margin, made-to-order.

| Field | Value |
|---|---|
| Business Name | Custom Awards Co |
| Business Type | E-Commerce |
| Revenue | $1,720,000 |
| Profit | $110,000 |
| 1-Year Goal | $3,500,000 |
| Constraint | Leads |
| Offer Headline | "Trophies and plaques for any occasion" |
| Price | $90 |
| Audience | "Coaches and event organizers" |

**Expected:**
- Stage: `Scale`
- Advice Type: Margin is 6.4% — "Charity Mode" flag MUST trigger.
- Score: Medium (Offer is generic).

---

## Scenario 5: "The Dreamer" (Synthetic - Stage 0)
**Profile:** Pre-revenue, no product, just an idea.

| Field | Value |
|---|---|
| Business Name | Future Ideas Inc |
| Business Type | SaaS |
| Revenue | $0 |
| Profit | $0 |
| 1-Year Goal | $100,000 |
| Constraint | Unknown |
| Offer Headline | "We are building something amazing" |
| Price | $0 |
| Audience | "Everyone" |

**Expected:**
- Stage: `Improvise`
- Advice Type: "Harsh Mentor" — Stop building, get 5 free users.
- Score: High (Price $0 is CORRECT for Stage 0).

---

## Test Execution Loop (Instructions)

For each scenario:
1. Clear localStorage / Reset App.
2. Complete Business Intake with scenario data.
3. Navigate to "The Offer Inspector".
4. Submit offer data.
5. **VERIFY:**
   - Correct Stage returned.
   - Critique matches expected advice type.
   - Score aligns with logic (High for good offers, Low for vague).
6. **LOG:** Pass/Fail + Screenshot.
7. **IF FAIL:** Stop and document issue.

After ALL scenarios pass:
- Update Non-Tech PRD with "User Stories" section.
- Append passing test references to `acceptance_criteria.md`.
