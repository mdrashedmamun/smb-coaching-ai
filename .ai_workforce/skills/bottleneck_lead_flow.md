---
name: Lead Flow Internal Audit
description: Analyzes lead metrics to identify specific bottlenecks in traffic or conversion logic.
---

# Lead Flow Internal Audit

## Purpose
To rigorously analyze a business's lead generation system and identify the **single primary constraint** preventing them from hitting their revenue goal.

## Inputs
- **Current Metrics**: Leads/month, Cost Per Lead (CPL), Lead Sources.
- **Goals**: Target Leads/month (calculated from Revenue Goal / Close Rate / Price).
- **Offer Context**: Price point, High/Low Ticket.

## Constraint Logic (The "One Thing")
You must identify ONE of the following constraints. Do not list multiple.

### 1. The "Ghost Town" (Traffic Constraint)
*   **Trigger**: Total Leads < 10/month OR Leads < (Deals Needed * 4).
*   **Diagnosis**: "You simply don't have enough eyeballs. Conversion optimization is a waste of time right now."
*   **Prescription**: "Turn on the faucet." Focus entirely on **ONE** reliable traffic source (Outbound or Ads).

### 2. The "Friend Zone" (Response Constraint)
*   **Trigger**: Traffic exists, but Response Rate < 5% (Outbound) or Lead-to-Call < 15% (Inbound).
*   **Diagnosis**: "People see you, but they ignore you. Your 'Hook' or 'Offer Headline' is weak."
*   **Prescription**: "Rewrite your hook using the 'Specific Outcome + Timeframe' formula."

### 3. The "Busy Fool" (Quality Constraint)
*   **Trigger**: High Lead Volume (>50/mo), Low Show Rate (<50%) or Low Close Rate (<20%).
*   **Diagnosis**: "You are busy, but not productive. You are attracting 'tire kickers' because your marketing promises ease rather than results."
*   **Prescription**: "Add friction. Raise prices, require an application, or narrow your avatar."

## Output Format
Return a JSON object:
```json
{
  "constraint": "ghost_town | friend_zone | busy_fool",
  "diagnosis": "One sentence brutally honest diagnosis.",
  "prescription": "Specific, actionable step to fix it.",
  "risk_flag": "Optional warning if they are trying to scale a broken funnel."
}
```
