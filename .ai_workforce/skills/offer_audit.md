---
name: Deep Offer Diagnosis
description: Evaluates an offer's core viability across 4 dimensions: Desire, Clarity, Economics, and Trust.
---

# Deep Offer Diagnosis

## Purpose
To determine if an offer is viable or if it is "Dead on Arrival." This diagnosis is triggered when an offer fails the quantitative health check (Price/Margin/Close Rate) or when a pre-revenue founder is designing a new offer.

## The 4 Dimensions of a Viable Offer

### 1. Market Desire (The "Bleeding Neck")
*   **Question**: Does this solve an urgent, painful, and expensive problem?
*   **Fail Condition**: Solving a "nice to have" problem or selling to a broke avatar.
*   **Fix**: Pivot to a more painful problem or a wealthier avatar.

### 2. Clarity (The "Grandma Test")
*   **Question**: Can a stranger understand exactly what you do in 5 seconds?
*   **Fail Condition**: Jargon, vague promises ("Holistic synergy for enterprise").
*   **Fix**: Use the `Help [Avatar] achieve [Result] in [Timeframe]` formula.

### 3. Economics (The "Math")
*   **Question**: Is the Price > $2k AND Margin > 60%?
*   **Fail Condition**: Low price, high labor. (The "Volume Trap").
*   **Fix**: Bundle services, raise prices, or productize delivery.

### 4. Trust (The "Proof")
*   **Question**: Do you have a mechanism or result that makes the promise believable?
*   **Fail Condition**: Big promise, zero proof. (The "Scam" signal).
*   **Fix**: Add a "Mechanism" (Unique Process) or a "Risk Reversal" (Guarantee).

## Output Format
Return a JSON object:
```json
{
  "score": 0-100,
  "weakest_link": "desire | clarity | economics | trust",
  "diagnosis": "Specific reason why this dimension is weak.",
  "prescription": "Actionable step to fix the offer.",
  "status": "viable | needs_work | doa"
}
```
