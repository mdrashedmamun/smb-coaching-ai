# Walkthrough: Phase 0 Offer Health Check

> **Date:** January 12, 2026
> **Commit:** `8f352ad`

---

## What We Built

**Phase 0: Offer Health Check** — the critical gate before Lead Audit.

This enforces the PRD's first principle:
> *"You could write the best sequence in the world and it really doesn't matter if you have an offer problem."*

---

## Flow Architecture

```
Strategic Fork (Landing)
        ↓
[High-Ticket Service]
        ↓
Offer Health Check ← NEW
        ↓
    ┌───┴───┐
    │       │
  PASS    FAIL
    │       │
    ↓       ↓
 Intake   Dead End
    ↓       (OfferFailScreen)
Dashboard
```

**Critical:** Phase 0 Fail is a **true dead end**. No intake access.

---

## Files Changed

### New Components

| File | Purpose |
|------|---------|
| `OfferHealthCheck.tsx` | Input screen + verdict logic |
| `OfferFailScreen.tsx` | Dead-end with resources + email capture |
| `PriceSignalScreen.tsx` | Active Choice Fork for underpriced offers |

### Updated

| File | Changes |
|------|---------|
| `DiagnosticFlow.tsx` | Added `offer_check` and `offer_fail` flow states |

---

## Verdict Logic

```typescript
const getVerdict = (closeRate: number, margin: number): Phase0Verdict => {
    const failClose = closeRate < 30;
    const failMargin = margin < 80;

    if (failClose && failMargin) return 'fail_both';
    if (failClose) return 'fail_close_rate';
    if (failMargin) return 'fail_margin';
    if (closeRate >= 60) return 'warn_underpriced';
    return 'pass';
};
```

| Verdict | Condition | Action |
|---------|-----------|--------|
| `pass` | Close ≥ 30% AND Margin ≥ 80% | Proceed to Intake |
| `warn_underpriced` | Close ≥ 60% | Show price signal, optional proceed |
| `fail_close_rate` | Close < 30% | Dead end |
| `fail_margin` | Margin < 80% | Dead end |
| `fail_both` | Both fail | Dead end |

---

## UX Highlights

### 1. Honesty Warning (PRD Risk Mitigation)
> "This only works if you're brutally honest. Vanity metrics here will give you a false diagnosis later."

### 2. Clear Verdict Display
- **Pass:** Green checkmark, "Offer Looks Healthy"
- **Warn:** Amber warning, "Price Signal Detected"
- **Fail:** Red X, "Your bottleneck isn't leads. It's your offer."

### 3. Fail Screen Resources
- Prescription: $100M Offers, price increase, avatar narrowing
- 30-day return email capture
- No path to Intake (enforced dead end)

---

## Tracking Ready

The following console logs are in place for later analytics:

```
[Phase0] Verdict: fail_close_rate { closeRate: 15, margin: 85 }
[Phase0] FAIL - blocking access to intake fail_close_rate
[Phase0] Email captured for 30-day return: founder@company.com
```

---

## Verification

Manual test cases:

| Input | Expected |
|-------|----------|
| Close: 15%, Margin: 85% | FAIL (close rate) |
| Close: 40%, Margin: 50% | FAIL (margin) |
| Close: 10%, Margin: 40% | FAIL (both) |
| Close: 85%, Margin: 90% | WARN (underpriced) |
| Close: 35%, Margin: 85% | PASS |

---

## What's Next

1. **Test on yourself** (as planned in PRD)
2. **Track Phase 0 fail rate** — North Star metric
3. **Beta with 5 founders** — watch what happens


---

## User Verification (Self-Test)

Performed a 5-profile stress test to validate the "Immune System" logic.

### 1. The "Successfully Stuck" Founder (Warn)
> *High Close Rate (78%), High Margin*
- **Result:** ✅ **WARN**. Triggered `PriceSignalScreen`.
- **Behavior:** Choice A ("Test Price") blocked progression. Choice B ("Audit Anyway") allowed entry to Intake.
- ![Warning Screen](price_signal_detected_v2_1768217044535.png)

### 2. The "Drowning in Demand" Founder (Fail)
> *Low Close Rate (22%)*
- **Result:** ✅ **FAIL**.
- **Diagnosis:** "Avatar or Sales Motion Issue".
- **Behavior:** Hard stop. No continue button.
- ![Fail Close](fail_screen_email_success_1768217661824.png)

### 3. The "Commodity Trap" Founder (Fail)
> *Low Margin (55%)*
- **Result:** ✅ **FAIL**.
- **Diagnosis:** "Commoditized Offer".
- ![Fail Margin](fail_screen_margin_1768217768083.png)

### 4. The "Complete Reset" Founder (Fail)
> *Low Close Rate (18%), Low Margin (40%)*
- **Result:** ✅ **FAIL**.
- **Diagnosis:** Identified BOTH issues.
- ![Fail Both](fail_screen_both_1768217873556.png)

### 5. The "Healthy" Founder (Pass)
> *Good Close Rate (38%), Good Margin (82%)*
- **Result:** ✅ **PASS**. "Offer Looks Healthy".
- **Behavior:** Smooth transition to Lead Audit.
- ![Pass Screen](offer_pass_screen_1768217966642.png)

---

## Key Insight

> **"The gate IS the product. Every fail is a saved customer from churn."**

