# Definition of Done (Investor-Grade)

> **Purpose:** No feature ships without passing these gates. These are not suggestions—they are alignment invariants that separate a compelling product from a fundable one.

---

## The 7 Success Criteria

Every feature must satisfy **all 7** before it can be marked complete.

| # | Criterion | Test Question | Fail Example |
|---|---|---|---|
| **1** | **Force a falsifiable number** | Can we compute a falsifiable outcome from this input? | Collecting "revenue range" instead of exact figure. |
| **2** | **Short-circuit fake sophistication** | If `outreach = 0`, does the system refuse to diagnose anything else? | Showing pricing advice when founder isn't talking to anyone. |
| **3** | **Expose an operational consequence** | Does this reveal hidden operational cost, not just feelings? | "You need more clients" vs. "You need 25 clients. Managing 25 clients is a nightmare." |
| **4** | **Reduce narrative wiggle room** | Can the founder spin this output into a comforting story? | "It looks like you might want to consider..." vs. "You did 0 outreach. You are choosing to fail." |
| **5** | **Increase probability of the next report** | Does this feature make them more likely to come back and report again? | Pure confrontation with no escalation logic → dropout. |
| **6** | **Produce institutional-grade signal** | Does this output support a **yes/no or rank-order decision** for a third party? | Output that sounds harsh but doesn't help a third party make a decision. |
| **7** | **Create economic gravity** | Does this feature increase the likelihood the founder pays *something* within 30 days? | Founder feels seen but buying behavior doesn't change. |

---

## The Two Quality Gates

Run these checks **in sequence** after building any feature.

### Gate 1: Shifu-Check (Founder Fidelity)

> "What would the Coach say if a founder showed them this screen?"

| Coach Would Say... | Feature Status |
|---|---|
| "But what's the *real* number?" | ❌ Incomplete. Force specificity. |
| "Why are you showing me this? You didn't do outreach." | ❌ Wrong prioritization. Short-circuit. |
| "Okay, now what are you going to do about it?" | ✅ Ready for Gate 2. |

### Gate 2: Incubator-Check (Institutional Value)

> "Does this output support a **yes/no or rank-order decision** for a third party?"

| Incubator Would Say... | Feature Status |
|---|---|
| "This is just mean. Where's the data?" | ❌ Fail. Add operational consequence. |
| "Interesting, but what does this tell me about their trajectory?" | ❌ Fail. Add falsifiable projection. |
| "I can use this to decide whether to invest more time in this founder." | ✅ Ship it. |

---

## Behavioral Continuity (Enforced, Not Aspirational)

> "Retention of reporting is the real unit. Not DAUs. Not engagement. **Reporting continuity.**"

### The Invariant

- One confrontation is theater.
- Repeated reporting is value.
- Longitudinal evidence is the asset.

### The Requirement (Hard Gate)

Every feature must include **at least one structural mechanism** that reinforces the next report:

| Mechanism | Description | Example |
|---|---|---|
| **Reminder** | Scheduled prompt to return | "You'll be asked to report again on Friday." |
| **Comparison** | Reference to last week's data | "Last week you did 5 Looms. This week: 0." |
| **Memory** | Stored admission surfaced later | "You said 'fulfillment' was the blocker last time." |
| **Deferred Consequence** | Score decay, escalating tone | "Your reliability score dropped from 8 to 5." |

If **none** of these are present, the feature does not ship.

### The Tension to Manage

> **Truth velocity vs data accumulation**

We can confront perfectly and still fail if founders churn before we get enough longitudinal data.

- Too soft → no behavior change → worthless
- Too harsh too fast → churn before data → no asset

Optimize for **truth at a sustainable velocity**.

---

## The Business Invariant (Never Forget)

> "No diagnosis is valid without contact attempts."

This is not just logic. This is a **hard business rule** that:

- Simplifies the diagnostic space
- Reduces model complexity
- Makes outcomes explainable to third parties
- Builds trust without black-box AI

If a founder has done **zero outreach**, the system must refuse to diagnose pricing, positioning, offer, or churn. It must return to the invariant:

> **"You are not talking to anyone. Fix this first."**

---

## Pre-Merge Checklist

Before merging any feature, confirm:

### The 7 Criteria
- [ ] **Falsifiable:** Every input leads to a computable outcome.
- [ ] **Short-circuited:** Outreach = 0 blocks all other diagnoses.
- [ ] **Consequential:** Output shows operational cost, not just feelings.
- [ ] **Wiggle-proof:** Founder cannot spin this into a comforting narrative.
- [ ] **Retention-positive:** This increases probability of next report.
- [ ] **Institution-ready:** A third party can make a yes/no decision from this.
- [ ] **Economic gravity:** This moves founder closer to payment.

### The 2 Gates
- [ ] **Shifu-Check passed:** Coach would not ask for more specificity.
- [ ] **Incubator-Check passed:** Third party can make a decision.

### Behavioral Continuity
- [ ] **At least one mechanism present:** Reminder, comparison, memory, or deferred consequence.

---

## ⚠️ Warnings (From Coach Sign-Off)

> **This Definition of Done is now strong enough to become dangerous.**

### Risk #1: Pain ≠ Goal

The language is sharp. Inexperienced builders may interpret this as "if it hurts, it's good."

**That's wrong.**

Pain is not the goal. **Signal extraction** is the goal.

The invariant:

> **If a feature increases confrontation but reduces reporting continuity, it failed.**

### Risk #2: Economic Gravity Must Be Measured

Criterion #7 is the easiest one to lie about internally. "This *feels* like it increases willingness to pay" is not enough.

**Instrument early:**

| Metric | What It Measures |
|---|---|
| Trial → Paid conversion | Does the free experience pull toward payment? |
| Intake → $9 | Does the audit create enough value to pay $9? |
| $9 → $29 | Does the one-time audit create enough value for recurring? |
| Reports before first payment | How much longitudinal data before monetization? |

If you don't instrument this, Criterion #7 becomes theater.

### Risk #3: This Is a Cultural Contract

This Definition of Done only works if:

- PMs are willing to kill their own features.
- Engineers are allowed to push back on founders.
- Shipping less is culturally acceptable.

> **If leadership ever says "let's relax this one gate just this once," the whole thing collapses into a checklist ritual.**

Break it once, and people will stop believing in it.

---

## Coach Sign-Off

| Reviewer | Role | Status | Conditions |
|---|---|---|---|
| Coach | Investor/Advisor | ✅ **Signed** | Instrument economic gravity. Enforce cultural contract. Pain ≠ goal. |

---

## Changelog

| Date | Change |
|---|---|
| 2026-01-12 | Initial Definition of Done created based on coach feedback. |
| 2026-01-12 | Added Criterion #7 (Economic Gravity). Tightened Criterion #6 to require yes/no decision support. Enforced behavioral continuity as hard gate with 4 required mechanisms. Added "truth velocity vs data accumulation" tension. |
| 2026-01-12 | **Coach signed off.** Added Warnings section with 3 risks, instrumentation requirements, and cultural contract clause. |

