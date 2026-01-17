# 01 Garbage Collection - Simulation Playbook (Service)

Timestamp: 2026-01-16 16:55:00 +06
Source: transcripts/100M/01 Building a $1,000,000 Business for a Stranger in 69 Minutes .rtf

## How to Use This
This is a reproducible teardown playbook. Follow the steps in order, collect the minimum inputs, and produce the outputs exactly as written. If you use assumptions, log them and label the result as scenario.

## Business Snapshot (Verbatim Anchors)
- "Our revenue is 642,000. Our net profit is -151,000." [0:18]
- "Our net margins are negative 23%." [0:26]
- "We need to become profitable." [0:33]
- "we have two types of avatars. 50% are what we call scatter. The other 50% are HOAs." [2:12]
- "for our scatter customers, we charge $29.67 a month, which is built quarterly at $89." [4:45]
- "as an intro offer, we offer three months free." [4:51]
- "I knock out 300 doors and my close rate is right around 26%." [5:45]
- "if you have call it 500 HOAs which represent 70% of the market is not a cold email play." [8:22]
- "I never want to have a commoditized service where I get into an auction" [20:03]
- "the business that I think you're really in is the efficiency business." [20:16]
- "do you think it's humanly possible to get 10 people to work on commission to knock these doors" [23:13]

## Required Inputs (Minimum to Simulate)
- Customer types (avatars) and their market share
- Pricing and billing cadence for each avatar
- Gross margin, net margin, and key cost drivers (repairs, fuel, labor)
- CAC and LTV (gross margin basis)
- Lead sources and close rates per channel
- Fulfillment capacity and route efficiency
- Upfront cash flow timing vs cost of service delivery

## Derived Metrics (From Transcript Numbers)
- Net margin: -23% (stated)
- Blended CAC: $67 with blended LTV (gross margin) of $1,300 [11:45]
- HOA CAC/LTV: CAC $1,200, LTV $23,000, LTV:CAC 18:1 [12:27]
- Scatter CAC/LTV: CAC $51, LTV $1,000, LTV:CAC 21:1 [12:53]
- Close rate (overall leads): 72 / 217 = 33% [9:25]

## Step-by-Step Teardown Process

### Step 1: Diagnose the Primary Constraint (Profitability)
Goal: Identify the core failure that blocks growth.

Evidence:
- "Our net margins are negative 23%." [0:26]
- "We need to become profitable." [0:33]

Decision rule:
- If net margin is negative, fix unit economics and cash flow before scaling lead volume.

Output:
- Constraint statement: "Business is cash-flow negative; fix offer and cash timing before scaling." \

### Step 2: Choose a Single Avatar Focus (One Avatar, One Channel)
Goal: Reduce dilution and focus on the highest leverage segment.

Evidence:
- "we have two types of avatars... scatter... HOAs" [2:12]
- "I think what we're going to do is... go avatar" [18:44]
- "You're at that stage where... one avatar, one channel, one product" [19:18]

Decision rule:
- If you have two avatars and five channels, choose one avatar and one dominant channel until profitability is restored.

Output:
- Avatar choice decision recorded with rationale.

### Step 3: Align Channel to Avatar (HOA vs Scatter)
Goal: Pick the right acquisition path for the chosen avatar.

Evidence:
- "if you have call it 500 HOAs... is not a cold email play" [8:22]
- "handwritten card personal gift drive up" [8:30]
- "doortodoor... close rate is right around 26%" [5:45]

Decision rule:
- HOA: use relationship-driven outreach and calendarized bid cycles.
- Scatter: scale door-to-door with commission reps.

Output:
- Channel plan: HOA = relationship cadence; Scatter = commission D2D.

### Step 4: Rebuild the Offer for Cash-Flow Timing
Goal: Ensure first 30 days cash covers CAC + initial fulfillment costs.

Evidence:
- "we just need cash in the first 30 days to be greater than your cost of goods sold and CAC" [16:01]
- "if we get upfront cash over call it 120 bucks, you could be good to go" [18:15]

Decision rule:
- If cash collected in month 1 is below CAC + first-month cost, restructure upfront payment or promo.

Output:
- Updated intro offer that clears CAC + first-month cost.

### Step 5: Avoid Commodity Pricing for HOA Bids
Goal: Prevent race-to-the-bottom bidding.

Evidence:
- "I never want to have a commoditized service where I get into an auction" [20:03]
- "the business... is the efficiency business" [20:16]

Decision rule:
- If HOA bidding is required, win via efficiency-based offer and cost advantage, not just price cuts.

Output:
- Efficiency differentiator list (route density, pickup cadence, service SLAs).

### Step 6: Scale Door-to-Door with Commission-Only Team
Goal: Create predictable lead flow without fixed payroll risk.

Evidence:
- "do you think it's humanly possible to get 10 people to work on commission" [23:13]
- "I will just rejig the offer so that I can get $42 plus what I have to pay them upfront" [24:17]

Decision rule:
- If per-sale commission is covered by upfront cash, expand D2D via commission-only team.

Output:
- D2D scaling plan with commission economics.

### Step 7: Reduce Waste and Route Inefficiency
Goal: Use route density and asset utilization to rebuild margins.

Evidence:
- "We're not utilizing our assets enough. Trash is a very capitalally intensive business." [0:40]
- "Routes are not super efficient." [0:47]

Decision rule:
- Prioritize route efficiency and asset utilization when margins are negative.

Output:
- Route optimization actions (density targets, pickup cadence, truck utilization).

### Step 8: Final Growth Physics Brief (Simulation Output)
Output should include:
- Constraint diagnosis
- Avatar and channel focus
- Offer cash-flow fix
- Channel scale plan
- Efficiency plan
- Updated unit economics

## Book Frameworks Applied (With Examples)

### 100M Offers - Value Equation (Applied)
Framework quote:
- 100M Offers, p. 62: "there are four primary drivers of value."
  - "The Dream Outcome" (increase)
  - "Perceived Likelihood of Achievement" (increase)
  - "Perceived Time Delay Between Start and Achievement" (decrease)
  - "Perceived Effort & Sacrifice" (decrease)

Example mapping for scatter customers:
- Dream outcome: reliable pickup at lower effort
- Likelihood: consistent service history + local proof
- Time delay: next-week service start
- Effort/sacrifice: simple signup, no contract

Additional offer anchors:
- 100M Offers, p. 43: "The pain is the pitch."
- 100M Offers, p. 43: "The degree of the pain will be proportional to the price you will be able to charge"

### 100M Leads - Simple First Offer (Applied)
Framework quote:
- 100M Leads, p. 48: "Advertising your core offer might be all you need to get leads to engage. Try this way first."

Example application:
- For scatter customers, run direct-response D2D on the core offer rather than layering complex lead magnets.

### 100M Money Models - Recurring Revenue Reality (Applied)
Framework quote:
- 100M Money Models, p. 103: "Good gyms have lots of recurring revenue. I had none."

Example application:
- If HOA churn or bidding pressure rises, protect recurring base with efficiency and renewal timing.

## Example Outputs (From This Case)
- Avatar focus: Scatter (short-term cash flow) or HOA (long-term share), choose one
- Channel focus: D2D commission-only for scatter, relationship cadence for HOA
- Offer fix: upfront cash >= CAC + first-month fulfillment
- Unit economics target: restore positive net margin through route efficiency

## Book Anchors (Direct Quotes)
- 100M Offers, p. 43: "The pain is the pitch."
- 100M Offers, p. 43: "The degree of the pain will be proportional to the price you will be able to charge"
- 100M Leads, p. 48: "Advertising your core offer might be all you need to get leads to engage. Try this way first."
- 100M Money Models, p. 103: "Good gyms have lots of recurring revenue. I had none."

## Simulation Checklist (Copy/Paste)
1) Record revenue, net margin, CAC, LTV, and route utilization.
2) Choose one avatar and one channel.
3) Align offer cash timing to CAC + fulfillment cost.
4) Scale the chosen channel (D2D or HOA outreach).
5) Implement route efficiency actions.
6) Produce Growth Physics Brief output.

## Assumptions Log (If Needed)
- Assumption 1: ______________________
- Assumption 2: ______________________
- Assumption 3: ______________________

