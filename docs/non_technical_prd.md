# Non-Technical PRD: The SMB Coaching AI (Alex Brain)

> **Version:** 1.0 (End of Phase 3)
> **Goal:** Automate the intelligence of a $100M Investment Consultant.
> **Audience:** Product Owners, Stakeholders, New Team Members.

---

## 1. The Vision ("The Why")
Most "Business AI" tools are just fancy calculators or generic chat bots. They fail because they lack **Context**. They give the same advice ("Run ads!") to a person with $0 revenue as they do to a person with $1M revenue.

**Our Goal:** Build an AI that **understands "Business Physics"**.
It must diagnose the *specific* bottleneck of a business based on its **Lifecycle Stage** and give customized, sometimes harsh, truth—just like a human investor would in the first 15 minutes of a call.

---

## 2. The Core Logic ("The Brain")
We are not building a chatbot. We are building a **Diagnostic Engine**.

### The "Stage-Gated" Strategy (Crucial)
We discovered (via transcript analysis) that advice must be opposite depending on the user's stage.

| Stage | The User | The Metric | The Advice (Logic) |
| :--- | :--- | :--- | :--- |
| **Stage 0: Improvise** | The "Dreamer" / Pre-Revenue | Engagement | **"Work for Free."** (Goal: Prove anyone cares). Ignore profit. |
| **Stage 1: Monetize** | The "Starter" / Inconsistent | Cash | **"Charge More."** (Goal: Prove strangers will pay). Ignore fancy tech. |
| **Stage 2: Scale** | The "Operator" / Growing | Profit Margin | **"Cut Costs / Systematize."** (Goal: Efficiency). |

**The Guardrail:** The AI is strictly forbidden from giving Stage 2 advice (e.g., "Hire a team") to a Stage 0 user.

### The "Universal Truths" (From 8-Transcript Analysis)
We analyzed 8 hours of live consulting calls to extract the **"7 Universal Questions"** every investor asks. These are now hard-coded into our Intake System:
1.  **"What is the goal?"** (Revenue target defined).
2.  **"Who do you help?"** (Avatar Specificity).
3.  **"How do you help them?"** (Mechanism).
4.  **"How do you get customers?"** (Acquisition Channel).
5.  **"How do you make money?"** (Pricing Power).
6.  **"What are the numbers?"** (The "Vitals" check).
7.  **"What is the constraint?"** (The bottleneck).

**Specific Diagnostic Flags (derived from patterns):**
*   **"Charity Mode":** If Profit Margin < 10%, the diagnosis is *always* "Pricing Issue", not "Leads Issue".
*   **"The Amplification Trap":** If Offer Score is low (<40), running Ads is forbidden. (Logic: "Ads just amplify a bad message").

---

## 3. What We Built (Phase 1-3 Summary)

### A. "The North Star" Intake (Data Collection)
Instead of a boring form, we built a psychological intake process that separates input into two buckets:
1.  **Where You Are:** Hard facts (Revenue, Margins, Business Type).
2.  **Where You Want To Be:** The "North Star" (90-day targets, 1-year goals, Primary Constraints).
*Why:* We cannot navigate without a destination. Knowing they want to make $1M changes the math vs wanting $100k.

### B. The "Offer Diagnostic" (module 1)
This is the first tool the user experiences. It analyzes their "Elevator Pitch".
*   **The Magic:** It doesn't just check grammar. It checks **Economics** and **Psychology**.
*   **The Persona Switch:**
    *   If Stage 0: The AI acts as a **"Harsh Mentor"** ("Stop dreaming, go get 1 user").
    *   If Stage 1: The AI acts as a **"Sales Director"** ("Your pricing is too low, you are running a charity").

---

## 4. Current Status & User Flow
1.  **User Lands:** Sees "Business Intake".
2.  **User Inputs:** Enters Revenue ($0), Goal ($100k), Offer ("I help people").
3.  **System Classifies:** "This is Stage 0".
4.  **Module 1 Runs:**
    *   *AI Analysis:* "Your offer is vague. Because you are Stage 0, do not run ads. Go DM 50 people."
    *   *Output:* A Score (e.g., 30/100), a Critique, an Improved Headline, and a Pitch.

---

## 5. User Stories (From Real Testing)

These personas are derived from transcript analysis and validated through automated testing.

### Story 1: "The Garbage Man" (Scale Stage)
> **Mike** runs a $1.2M/year waste management company. He entered:
> - Headline: *"We haul your trash"*
> - Price: $50/month
> 
> **System Response:** Score F (Invisible). *"Your offer is invisible. You are selling features, not results. No one wakes up wanting your 'service'."*
> 
> **Why it works:** Despite high revenue, Mike's vague positioning limits pricing power. The system correctly identified this as the constraint.

### Story 2: "The Stylist" (Monetize Stage)
> **Sarah** runs an $80k/year salon. She entered:
> - Headline: *"I help people look good"*
> - Price: $200
> 
> **System Response:** Score F (Invisible). Critique identified the grandmother test failure—no specific audience or transformation.

### Story 3: "The Techie" (Scale Stage)
> **David** runs a $150k/year DevOps consultancy. He entered:
> - Headline: *"Cut your cloud costs by 40% in 90 days or your money back"*
> - Price: $5,000
> - Audience: *"CTOs at mid-sized SaaS companies running on AWS"*
> 
> **System Response:** Score A (Strong). *"Strong offer. Good pricing power. Now focus on delivery."*
> 
> **Why it works:** Specific numbers, guarantee, and narrow audience = premium pricing.

### Story 4: "The Dreamer" (Improvise Stage)
> **Alex** has $0 revenue and an idea. He entered:
> - Headline: *"We are building something amazing"*
> - Price: $0
> 
> **System Response:** Score 100 (Correct for Stage). *"You are in Stage 0 (Pre-Revenue). Stop building. Go find 5 people to serve for FREE today."*
> 
> **Why it works:** For Stage 0, $0 pricing is the RIGHT answer. The advice adapts: "prove anyone cares" before monetizing.

---

## 6. What's Next (The Roadmap)
*   **Module 2 (The Funnel):** Diagnosing *how* they get leads (Ads vs Content).
*   **Module 3 (The Systems):** Diagnosing their time usage (Working *in* vs *on* business).
*   **The Dashboard:** A centralized "Control Center" showing their Business Health Score.

---

## 7. Handover Note to New Team Members
*   **Don't trust the LLM to just "be smart".** We specifically engineered the prompts to force it to adhere to the *Universal Logic Map*.
*   **Always checking Stage.** Every new feature must first ask: "Does this apply to Stage 0, 1, or 2?"
*   **Simplicity first.** The User is likely overwhelmed. Our UI must be calm, linear, and decisive.

---

## 8. UI Language Guidelines
*   **No "Module X" labels.** Use system names like "The Offer Inspector", "The Funnel Inspector".
*   **Dashboard = "Mission Control".**
*   **Tool views start with "THE [NAME]" header** (e.g., "THE OFFER INSPECTOR").
