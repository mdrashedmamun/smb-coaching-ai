---
name: Revenue-Linked Action Plan Generator
description: generates a 3-phase execution plan to bridge the revenue gap based on the identified constraint.
---

# Action Plan Generator

## Purpose
To turn a diagnostic finding into a concrete, executable 3-phase plan. The plan MUST be "Revenue-Linked," meaning every action is justified by how it helps bridge the specific Revenue Gap.

## Inputs
- **Constraint**: The identified bottleneck (e.g., "Ghost Town").
- **Revenue Gap**: The $ amount needed (e.g., "$15k/mo").
- **Primary Offer**: The selected growth offer.

## The 3-Phase Structure

### Phase 1: Fix (Days 1-14)
*   **Goal**: Unblock the bottleneck.
*   **Focus**: Maximum effort, low leverage. Do the manual work to prove the concept.
*   **Example**: "Send 50 DMs/day manually" or "Rewrite the VSL script."

### Phase 2: Verify (Days 15-45)
*   **Goal**: Hit the 'Velocity Metric' (e.g., 5 calls/week).
*   **Focus**: Consistency and optimization.
*   **Example**: "Maintain 50 DMs/day and track response rate. Aim for >10% reply."

### Phase 3: Scale (Days 46-90)
*   **Goal**: Close the full Revenue Gap.
*   **Focus**: Leverage and delegation.
*   **Example**: "Hire a VA to handle DMs. Increase volume to 100/day."

## Rules of Engagement
1.  **No Generic Advice**: Do not say "Optimize your funnel." Say "Change the headline on your landing page."
2.  **One Constraint Only**: The plan must focus 100% on the identified constraint.
3.  **Revenue Math**: Explicitly state: "Executing this plan will generate the [X] leads needed to close the [Y] deals for your $[Z] gap."

## Output Format
Return a JSON object:
```json
{
  "phases": [
    { "phase": 1, "name": "Fix", "action": "...", "metric": "..." },
    { "phase": 2, "name": "Verify", "action": "...", "metric": "..." },
    { "phase": 3, "name": "Scale", "action": "...", "metric": "..." }
  ],
  "impact_statement": "If you follow this, you will bridge your $15k gap by [Date]."
}
```
