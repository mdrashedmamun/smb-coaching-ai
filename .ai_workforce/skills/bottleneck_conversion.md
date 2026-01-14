---
name: Conversion Bottleneck Diagnosis
description: Analyzes why leads are not converting to closed deals. Focuses on sales process, objection handling, and pricing alignment.
---

# Conversion Bottleneck Diagnosis

## Purpose
To identify the root cause of low close rates (< 30%) and prescribe specific fixes to improve sales conversion.

## Inputs
- **Close Rate**: Current % of calls that result in closed deals.
- **Sales Call Volume**: Number of calls/month.
- **Offer Price**: Price point of the primary offer.
- **Primary Objections**: Common reasons prospects don't buy.

## Constraint Logic

### 1. The "Tire Kicker" Problem
*   **Trigger**: Close Rate < 20%, High call volume.
*   **Diagnosis**: "You're attracting unqualified leads. They can't afford you or don't have a real problem."
*   **Prescription**: "Add friction. Require an application or raise your qualifying bar."

### 2. The "Trust Gap" Problem
*   **Trigger**: Close Rate 20-30%, Strong lead quality.
*   **Diagnosis**: "Leads are interested but not convinced. Your proof or mechanism is weak."
*   **Prescription**: "Add case studies, testimonials, or a risk reversal (guarantee)."

### 3. The "Price Shock" Problem
*   **Trigger**: Close Rate drops after price reveal.
*   **Diagnosis**: "You're not building enough value before the price. The ask feels bigger than the promise."
*   **Prescription**: "Restructure your pitch: Problem → Mechanism → Result → Price. Never lead with price."

### 4. The "Wrong Avatar" Problem
*   **Trigger**: Low close rate across all segments.
*   **Diagnosis**: "You're selling to people who don't have the problem you solve."
*   **Prescription**: "Narrow your avatar until it feels uncomfortable. Specificity = premium pricing."

## Output Format
```json
{
  "constraint": "tire_kicker | trust_gap | price_shock | wrong_avatar",
  "diagnosis": "One sentence brutally honest diagnosis.",
  "prescription": "Specific, actionable step to fix it.",
  "close_rate_improvement": "Expected improvement range (e.g., +10-15%)"
}
```
