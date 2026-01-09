# Universal Logic Map
> [!NOTE]
> Recreated based on Transcript Analysis (Vol 1-8) and Course Material Part A.

## Scaling Roadmap Stages (Pre-Diagnostic Classifier)
*Derived from "Stage 0: Improvise" and "Stage 1: Monetize" Strategic Docs.*

### Stage 0: Improvise (The "Practice Mode")
*   **Trigger**: `Revenue` == 0 OR `Goal` == "Get people to try free stuff".
*   **Definition**: "You are a researcher, not a business owner yet."
*   **Success Metric**: Engagement / Feedback (NOT Profit).
*   **Constraint**: "You have nothing to sell."
*   **Prescription**: "Make something FREE. Get engaged users. Do NOT worry about high ticket yet."

### Stage 1: Monetize (The "Starter")
*   **Trigger**: `Revenue` > 0 but `MonthlySales` < Consistent.
*   **Definition**: "You are a starter. You are proving strangers will pay."
*   **Success Metric**: First 5 consistent sales.
*   **Constraint**: Product Quality ("Not good enough to sell") or Obscurity ("No one knows").
*   **Prescription**: "Fix the V1 product. Ask for money. Validate pricing power."

---

## Module 1: Offer Diagnostic (The "Promise")

### Core Principle: The Amplification Trap
*   **Rule**: If Offer Score < 70, **BLOCK** access to paid ad strategies (Module 6).
*   **Quote**: "Great marketing cannot fix a broken offer. If you amplify a weak offer, you just show flaws to more people."

### Scoring Logic (Total: 100 Points)

#### 1. Clarity & Outcome (40 Points)
*   **Analysis**: Check `OfferHeadline`.
*   **Positive Signals (+10 each)**:
    *   Contains numeric result (e.g., "30 days", "10k", "20lbs").
    *   Contains specific timeline.
    *   Uses "Help [Avatar] achieve [Result]" format.
*   **Negative Signals (-10 each)**:
    *   Contains jargon ("holistic", "synergy", "quality", "comprehensive").
    *   Focuses on "Feature" instead of "Outcome" (e.g., "We do SEO" vs "We get leads").

#### 2. Avatar Specificity (30 Points)
*   **Analysis**: Check `TargetAudience`.
*   **Positive Signals (+30)**:
    *   Detailed description (e.g., "Dentists in Ohio", "Post-partum moms").
    *   High Intent words ("Owners", "Founders", "Suffering from X").
*   **Negative Signals (-20)**:
    *   "Anyone", "Everyone", "Small Businesses" (too broad).

#### 3. Pricing Power (30 Points)
*   **Analysis**: Check `PricePoint` and `PricingModel`.
*   **High Ticket Bias**:
    *   If `PricePoint` > $1,000 -> **+30** (Premium/Outcome based).
    *   If `PricePoint` > $200 -> **+15**.
    *   If `PricePoint` < $100 -> **0** (Commodity Danger Zone).
    *   *Exception:* If **Stage 0** and Price is **$0** -> **+40** ("The Free Pilot").
*   **Model Bias**:
    *   `Subscription` -> **+10** (Recurring Revenue Health).

### Transcript-Derived Diagnostic Flags
*These are specific "investor trigger points" identified across 8 consults.*

| Flag Name | Trigger Condition | Diagnostic Output |
| :--- | :--- | :--- |
| **"Charity Mode"** | Profit <= 0 OR Margin < 10% | **CRITICAL**: "You are running a charity, not a business. Immediate pricing or cost intervention needed." |
| **"Supply/Demand Mismatch"** | "Lines out the door" / Max Capacity + No recent price hike | **OPPORTUNITY**: "Oldest law in business: Raise prices to match demand. You are undercharging." |
| **"The Upsell Gap"** | Low Ticket Front-End (<$100) + Low Upsell Rate (<20%) | **WARNING**: "You are acquiring customers at a loss/break-even without a profit maximizer. Fix the upsell." |
| **"The Hobbyist"** | Revenue < $5k/mo + "Passive" Goal | **REALITY CHECK**: "This is a hobby. Decide if you want a business." |

### Constructive Feedback Rules
*   **IF Score < 60 ("F" - Invisible)**:
    *   *Critique*: "Your offer is invisible. You are selling a process (features), not a result. No one wakes up wanting 'SEO Services'. They wake up wanting 'More Sales'."
    *   *Prescription*: "Rewrite your headline using this formula: 'I help [Specific Avatar] get [Specific Result] in [Timeframe] without [Pain].'"
*   **IF Score 60-79 ("C" - Boring)**:
    *   *Critique*: "You are safe, but boring. You sound like everyone else. Why should I pick you over the cheap option?"
    *   *Prescription*: "Add a 'Mechanism'. How do you do it differently? Name your process."
*   **IF Score > 80 ("A" - Unignorable)**:
    *   *Critique*: "Strong offer. Now the risk is delivery. Can you actually fulfill this promise?"
    *   *Prescription*: "Proceed to Funnel Diagnostic to ensure you can handle the volume."

---

## Module 2: Visual Funnel (The "Path")

### Core Principle: The Leaky Bucket
*   **Rule**: If `FunnelStages` < 4 (e.g., just Ad -> Sale), flag as "Marriage on First Date".
*   **Logic**:
    *   **Leaky**: Missing "Nurture" or "Lead Magnet" step.
    *   **Solid**: Ad -> Magnet -> Nurture -> Call -> Sale.

## Module 3-7 (Placeholder Logic)
*   **Module 5 (Vitals)**:
    *   If `NetMargin` < 20% -> Flag "Starvation Mode". Service businesses should be 30%+.
    *   If `Churn` > 10% (Monthly) -> Flag "Bucket with a hole". Stop ALL acquisition.
