# Lead Bottleneck Audit
**A diagnostic + accountability engine that identifies why high-ticket service founders aren't generating enough leads and holds them accountable to fix it.**

| Field | Value |
|-------|-------|
| Team | Antigravity Core |
| Contributors | Rashed (PM/Founder), AI Engineering |
| Resources | [Hot Seat Transcripts], [8-Metric Framework], [Soft Bottleneck Framework] |
| Status | Draft |
| Last Updated | January 12, 2026 |

---

## Problem Alignment

### Problem Statement
High-ticket service founders know they need more leads but don't do consistent outreach. Existing tools (calendars, CRMs, VAs) remind them but don't confront them with why they're avoiding the work or hold them accountable when they skip.

### Why This Matters

**To Customers:**
- They're stuck at $10-30K/month and can't break through
- They know outreach works but don't do it consistently
- They waste money on tools that don't address the real problem (behavior, not technology)

**To Business:**
- Direct revenue impact: founders who fix their lead problem will pay to stay
- Retention moat: behavioral data creates switching cost
- Premium positioning: we're not a CRM, we're a coach that remembers

### Evidence & Insights

| Insight | Source |
|---------|--------|
| 45% of B2B businesses struggle to generate enough leads | sopro.io (2024) |
| Cold email reply rates dropped to <1-5% | belkins.io, martal.ca (2024) |
| 41% of companies struggle to follow up in time | explodingtopics.com |
| 86% of B2B decisions influenced by word-of-mouth | explodingtopics.com |
| "All roads lead back to: most problems get solved when you talk to more people" | Hot Seat Transcript (PGA) |
| Founders who do zero outreach blame the market, not themselves | Hot Seat pattern |

---

## High Level Approach

A **Hot Seat Simulator** that:
1. **Audits** the founder's lead funnel (8 core metrics)
2. **Identifies** the specific bottleneck (volume, skill, belief)
3. **Surfaces** the soft bottleneck behind it (time, energy, attention, effort)
4. **Prescribes** one action with a specific number
5. **Holds accountable** via daily/weekly check-ins that confront, not remind

---

## Narrative

### Scenario A: The Zero Outreach Founder

**Today (without the product):**
> "I'm stuck at $15K/month. I know I should do more outreach but I'm so busy with fulfillment. I've tried Apollo, Instantly, hired a VA... nothing works. I guess my niche is saturated."

**With Lead Bottleneck Audit:**
> The system asks: "How many cold outreaches did you send this week?"
> Founder enters: "0"
> System responds: "Your bottleneck is not your niche. It's that your outreach is zero. This week: 20 Looms. Report back Friday."
> Friday: "Did you send 20 Looms? [Yes] [No – Tell me why]"
> Founder clicks "No" → "What got in the way?"
> System stores the admission: "You said fulfillment was the reason. Noted. Next week: same prescription."

### Scenario B: The Price-Too-Low Founder

**Today:**
> "I have 6 clients at $3K each. I want to get to $50K/month but I'm maxed out on capacity."

**With Lead Bottleneck Audit:**
> System calculates: "At $3K/client, you'd need 17 clients to hit $50K. That's unsustainable."
> System diagnoses: "Your bottleneck isn't more clients. It's your price. Raise to $5K."
> Prescription: "This week: Tell 3 existing clients your rates are changing. By October 1st, all clients on new rate."
> Check-in: "Did you have the conversation? [Yes] [No – Tell me why]"

### Scenario C: The Shiny New Offer Founder

**Today:**
> "I get a lot of inbound from broke founders who can't afford my $5K offer. I'm thinking of building a $2K offer for them."

**With Lead Bottleneck Audit:**
> System asks: "If you knew with 100% certainty that 100 quality Looms would max out your capacity at $5K, would you still want to build the $2K offer?"
> Founder: "...No."
> System: "Then we're not building that. This week: 20 Looms to qualified prospects. Report back."

---

## Goals

| Priority | Goal | Measurable? |
|----------|------|-------------|
| P0 | Founders identify their SPECIFIC lead bottleneck (not a vague "need more leads") | Yes: Bottleneck identified in <5 minutes |
| P0 | Founders take ONE prescribed action each week | Yes: Action completion rate >50% |
| P1 | Founders feel confronted, not coddled | Feeling: "This product sees through my excuses" |
| P1 | Founders return weekly to report | Yes: Weekly return rate >60% |
| P2 | Founders show measurable improvement in lead metrics over 30 days | Yes: Self-reported metric improvement |

## Non-Goals

| Non-Goal | Why Not |
|----------|---------|
| Build an outreach tool (send emails, automate DMs) | We're not a CRM. We're accountability. |
| Teach sales skills (scripting, objection handling) | That's what PGA is for. We diagnose, not train. |
| Support all business types (e-commerce, SaaS, etc.) | Focus: High-ticket service founders only. |
| Gamification (streaks, badges, leaderboards) | Psychological accountability, not dopamine. |

---

> [!CAUTION]
> 🛑 Do not continue if all contributors are not aligned on the problem.

### Problem Alignment Sign-Off

| Reviewer | Team/Role | Status |
|----------|-----------|--------|
| Rashed | Founder/PM | ⬜ Pending |
| Coach | Advisor | ⬜ Pending |

---

## Solution Alignment

### Key Features

#### Plan of Record

| Priority | Feature | Description |
|----------|---------|-------------|
| P0 | **Goal + Constraints Intake** | Collect: Revenue goal, max clients, target margin, team structure |
| P0 | **Actuals Audit** | Collect: Last 30 days revenue, broken down by client and offer |
| P0 | **8-Metric Funnel Audit** | Collect: Cold outreach, cold responses, warm outreach, warm responses, inbound, Looms filmed, sales calls, clients closed |
| P0 | **Gap Calculation** | System shows: "You're at $X. Goal is $Y. Gap is $Z." |
| P0 | **Model Play-Out** | System shows: "At $X/client, you'd need Y clients. Is that sustainable?" |
| P0 | **Bottleneck Detection** | System identifies: Volume, Skill, or Belief problem |
| P0 | **Soft Bottleneck Probe** | System asks: "What's getting in the way? Time, Energy, Attention, or Effort?" |
| P0 | **Prescription Engine** | System prescribes: "This week: [Action] × [Number]" |
| P1 | **Accountability Check-In** | Weekly: "Did you do [Action]? [Yes] [No – Tell me why]" |
| P1 | **Admission Storage** | System stores: "You said [reason] was the blocker." |
| P2 | **Pattern Surfacing** | System shows: "You've skipped outreach for 3 weeks. Here's what your numbers show." |
| P2 | **Re-Audit Prompt** | Monthly: "Let's re-audit your funnel. What are your numbers now?" |

#### Future Considerations

| Feature | Save For Later Because... |
|---------|---------------------------|
| Automated outreach tracking (via API) | Increases complexity. Start with self-report. |
| CRM integration | Not core to accountability. Nice-to-have. |
| Peer comparison ("Founders like you...") | Requires cohort data. Later. |
| AI-generated outreach scripts | Training, not accountability. Different product. |

---

### Key Flows

#### Flow 1: Initial Lead Audit

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GOAL + CONSTRAINTS                                       │
│    "What's your monthly revenue goal?"                      │
│    "What's the max number of clients you want?"             │
│    "What margin are you targeting?"                         │
│    "Do you want to be the writer or the operator?"          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ACTUALS AUDIT                                            │
│    "What was your revenue last 30 days?"                    │
│    "Break it down by client:" [Client 1: $X] [Client 2: $Y] │
│    "What offer does each client have?"                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. 8-METRIC FUNNEL AUDIT                                    │
│    "How many cold outreaches did you send this week?"       │
│    "How many responded?"                                    │
│    "How many warm outreaches?"                              │
│    "How many Looms did you film?"                           │
│    "How many sales calls did you have?"                     │
│    "How many clients did you close?"                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. GAP CALCULATION                                          │
│    "You're at $19K. Goal is $50K. Gap is $31K."              │
│    "At $3K/client, you'd need 17 clients. That's too many." │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. BOTTLENECK DETECTION                                     │
│    "Your outreach this week was: 0"                         │
│    "That's the bottleneck. You're not talking to anyone."   │
│                                                             │
│    OR                                                       │
│                                                             │
│    "Your price is $3K/client. That's too low."              │
│    "That's the bottleneck. You're leaving money on table."  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. SOFT BOTTLENECK PROBE                                    │
│    "Why aren't you doing outreach?"                         │
│    [ ] Time – "I don't have enough hours"                   │
│    [ ] Energy – "I'm burned out from fulfillment"           │
│    [ ] Attention – "I get distracted by client work"        │
│    [ ] Effort – "I know I should but I don't push myself"   │
│    [ ] Belief – "I don't think it works for my niche"       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. PRESCRIPTION                                             │
│    "Your prescription for this week:"                       │
│    ┌───────────────────────────────────────────────────┐    │
│    │  Send 20 Looms to qualified prospects.            │    │
│    │  Report back on Friday.                           │    │
│    └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Flow 2: Weekly Accountability Check-In

```
┌─────────────────────────────────────────────────────────────┐
│ ACCOUNTABILITY CHECK-IN (Friday)                            │
│                                                             │
│ "Your prescription was: Send 20 Looms."                     │
│                                                             │
│ "Did you do it?"                                            │
│ [Yes, I sent 20+]  [Partially, I sent ___]  [No]            │
└─────────────────────────────────────────────────────────────┘
                              ↓
           ┌──────────────────┴──────────────────┐
           ↓                                      ↓
┌──────────────────────┐              ┌──────────────────────┐
│ IF YES               │              │ IF NO                │
│                      │              │                      │
│ "Great. How many     │              │ "What got in the     │
│ responses did you    │              │ way?"                │
│ get?"                │              │                      │
│ [Number input]       │              │ [ ] Time             │
│                      │              │ [ ] Energy           │
│ "Your next week:     │              │ [ ] Attention        │
│ Keep the momentum.   │              │ [ ] Effort           │
│ 20 more Looms."      │              │ [ ] Other: ___       │
└──────────────────────┘              └──────────────────────┘
                                                  ↓
                              ┌─────────────────────────────────────────────────────────────┐
                              │ ADMISSION STORED                                            │
                              │                                                             │
                              │ "Noted. You said [reason] was the blocker."                 │
                              │ "This is the 3rd week you've skipped."                      │
                              │                                                             │
                              │ "Same prescription: 20 Looms. But let's address [reason]." │
                              │ "What would make it possible this week?"                    │
                              │ [Free text input]                                           │
                              └─────────────────────────────────────────────────────────────┘
```

---

### Key Logic

#### Bottleneck Detection Rules

| Metric Pattern | Detected Bottleneck | Prescription |
|----------------|---------------------|--------------|
| Outreach = 0 | **Volume (Outreach)** | "Send X Looms/DMs this week." |
| Outreach > 50, Responses = 0 | **Skill (Messaging)** | "Your messages aren't landing. Let's review 3 together." |
| Responses > 10, Calls = 0 | **Volume (Follow-up)** | "You have interest but aren't following up. Book X calls." |
| Calls > 5, Closed = 0 | **Skill (Sales)** | "You're not closing. Let's review a call recording." |
| Revenue ÷ Clients < $4K | **Price** | "Raise price to $5K. Pitch new clients at new rate." |
| Clients > 10, Capacity = 0 | **Capacity** | "You're full. Raise price or drop lowest-paying client." |

#### Soft Bottleneck Mapping

| Soft Bottleneck | Follow-Up Question | Stored Admission |
|-----------------|---------------------|------------------|
| Time | "What would you need to drop to make time?" | "[Founder] admitted time is the blocker." |
| Energy | "What's draining you? Fulfillment? Admin?" | "[Founder] admitted energy is the blocker." |
| Attention | "What's distracting you? Client reactivity?" | "[Founder] admitted attention is the blocker." |
| Effort | "Are you avoiding the discomfort of outreach?" | "[Founder] admitted effort is the blocker." |
| Belief | "Do you believe outreach works for your niche?" | "[Founder] admitted a belief problem." |

#### Prescription Logic

| Constraint | Default Prescription |
|------------|----------------------|
| First audit, Outreach = 0 | "20 Looms this week." |
| Second week, still 0 | "10 Looms this week. What would make 10 possible?" |
| Third week, still 0 | "5 Looms. Just 5. What's the blocker?" |
| Completed last week | "Same or +10% volume. Keep momentum." |
| Price bottleneck | "Tell 3 existing clients your rates are changing." |

---

> [!CAUTION]
> 🛑 Do not continue if all contributors are not aligned on the solution.

### Solution Alignment Sign-Off

| Reviewer | Team/Role | Status |
|----------|-----------|--------|
| Rashed | Founder/PM | ⬜ Pending |
| Coach | Advisor | ⬜ Pending |

---

## Launch Plan

### Key Milestones

| Target Date | Milestone | Description | Exit Criteria |
|-------------|-----------|-------------|---------------|
| Week 1 | ✅ V0 Build | Build intake + audit + prescription flow | Functional flow, no accountability yet |
| Week 2 | 🛑 Internal Test | Rashed uses it on self | Identifies real bottleneck, receives prescription |
| Week 3 | 🛑 Beta (5 founders) | Hand-pick 5 high-ticket founders | 3/5 complete audit, 2/5 report back |
| Week 4 | 🛑 Paid Pilot ($9) | Charge $9 for audit | 10 paid audits completed |
| Week 6 | 🛑 Starter Launch ($29/mo) | Add weekly accountability loop | 5 founders on recurring |

### Operational Checklist

| Team | Prompt | Y/N | Action (if yes) |
|------|--------|-----|-----------------|
| Analytics | Do you need additional tracking? | Y | Track: audit completion, bottleneck distribution, check-in return rate |
| Sales | Do you need sales enablement materials? | N | Self-serve at $9/$29 |
| Marketing | Does this impact shared KPI? | Y | New KPI: audits completed, weekly return rate |
| Customer Success | Do you need to update support content? | N | Not yet |
| Product Marketing | Do you need a GTM plan? | Y | Position as: "Your lead problem isn't technology. It's behavior." |

---

## Appendix

### Changelog

| Date | Description |
|------|-------------|
| 2026-01-12 | Initial PRD created based on Hot Seat transcripts and bottleneck analysis frameworks |

### Open Questions

| Question | Status | Answer |
|----------|--------|--------|
| Should we collect exact client names or just numbers? | ⬜ Open | |
| How do we verify self-reported metrics? | ⬜ Open | Start with trust. Add verification later. |
| Should prescription be AI-generated or rule-based? | ⬜ Open | Start rule-based. Simpler. |

### FAQs

**Q: How is this different from a CRM?**
A: CRMs track leads. We confront founders about why they're not generating leads.

**Q: How is this different from a calendar reminder?**
A: Calendars remind. We remember your admissions and pattern-surface your avoidance.

**Q: What if the founder lies about their numbers?**
A: They're only lying to themselves. The pattern will reveal it over time.

---

### Source Framework References

| Document | Purpose |
|----------|---------|
| [Soft Bottlenecks Framework](./soft_bottlenecks.md) | Time, Energy, Attention, Effort, Stress |
| [8-Metric Funnel](./8_metric_funnel.md) | Cold Outreach → Clients Closed |
| [Bottleneck Analysis Philosophy](./bottleneck_philosophy.md) | Naked Man, Pitching Machine |
| [Hot Seat Patterns](./hot_seat_patterns.md) | Live diagnostic + accountability examples |
