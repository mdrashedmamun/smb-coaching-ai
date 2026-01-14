---
name: Follow-Up Bottleneck Diagnosis
description: Analyzes why leads go cold before converting. Focuses on response time, nurturing sequences, and persistence gaps.
---

# Follow-Up Bottleneck Diagnosis

## Purpose
To identify why leads are dropping off between initial contact and sales call. This is the "leaky bucket" in most funnels.

## Inputs
- **Response Rate**: % of leads who reply to initial outreach.
- **Show Rate**: % of booked calls that actually happen.
- **Time to Follow-Up**: Average hours between lead capture and first response.
- **Nurture Sequence**: Number of follow-up touches before giving up.

## Constraint Logic

### 1. The "Slow Response" Problem
*   **Trigger**: Time to follow-up > 24 hours.
*   **Diagnosis**: "Speed wins. Leads go cold after 24 hours. You're losing to competitors who respond faster."
*   **Prescription**: "Set up instant auto-reply + same-day personal follow-up. Aim for < 5 minute response."

### 2. The "One and Done" Problem
*   **Trigger**: Fewer than 5 follow-up touches.
*   **Diagnosis**: "Most deals close after 5-12 touches. You're giving up too early."
*   **Prescription**: "Build a 7-touch follow-up sequence. Mix channels: email, DM, voice note."

### 3. The "No Show" Problem
*   **Trigger**: Show rate < 70%.
*   **Diagnosis**: "People are booking but not showing. Your pre-call warming is weak or the gap is too long."
*   **Prescription**: "Send a value-packed reminder 24h and 1h before. Shorten booking-to-call gap to < 48h."

### 4. The "Ghost After Quote" Problem
*   **Trigger**: Leads disappear after receiving proposal/price.
*   **Diagnosis**: "They're shopping you. Your follow-up after the pitch is weak or non-existent."
*   **Prescription**: "Send a 'Fear of Missing Out' follow-up 24h after quote. Add urgency or scarcity."

## Output Format
```json
{
  "constraint": "slow_response | one_and_done | no_show | ghost_after_quote",
  "diagnosis": "One sentence brutally honest diagnosis.",
  "prescription": "Specific, actionable step to fix it.",
  "metric_improvement": "Expected show rate or response rate improvement"
}
```
