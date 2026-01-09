# Acceptance Criteria: SMB Coaching AI (Phase 1-3)

> **Source of Truth:** 8-Transcript Analysis, Stage 0/1 PDFs, Course Material Part A.
> **Format:** Feature -> Acceptance Criteria -> Test Case -> Expected Result.

---

## Feature 1: Business Intake ("The Vitals")

### AC-1.1: Collects Core Identity
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-1.1.1 | User MUST enter a business name. | Submit form with empty name. | Form validation error. |
| AC-1.1.2 | User MUST select a business type. | Submit without selecting type. | Form validation error. |

### AC-1.2: Collects Financial Vitals (Transcript-Derived)
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-1.2.1 | Revenue is collected (Number). | Enter `50000`. | Stored in `context.vitals.revenue`. |
| AC-1.2.2 | Profit is collected (Number). | Enter `10000`. | Stored in `context.vitals.netProfit`. |
| AC-1.2.3 | System calculates Margin automatically. | Revenue=100k, Profit=10k. | Margin = 10%. |

### AC-1.3: Collects "North Star" Goals (Transcript-Derived)
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-1.3.1 | User MUST enter a 1-Year Revenue Target. | Enter `1000000`. | Stored in `context.goals.revenue1Year`. |
| AC-1.3.2 | User MUST select a Primary Constraint. | Select "Leads". | Stored as `context.goals.primaryConstraint = 'leads'`. |

---

## Feature 2: Stage Classifier (PDF-Derived)

### AC-2.1: Stage 0 Detection ("Improvise")
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-2.1.1 | If Revenue == $0, Stage is "Improvise". | Submit intake with Revenue=0. | Backend returns `stage: 'Improvise'`. |
| AC-2.1.2 | Stage 0 users receive "Harsh Mentor" persona. | Analyze offer for Stage 0 user. | Critique includes "Work for free" advice. |
| AC-2.1.3 | Pricing $0 is NOT penalized for Stage 0. | Submit offer with Price=0 as Stage 0. | Score includes +30 points (not penalty). |

### AC-2.2: Stage 1 Detection ("Monetize")
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-2.2.1 | If Revenue > $0 AND Revenue < $100k, Stage is "Monetize". | Submit intake with Revenue=50000. | Backend returns `stage: 'Monetize'`. |
| AC-2.2.2 | Stage 1 users receive "Sales Director" persona. | Analyze offer for Stage 1 user. | Critique includes "Raise your prices" advice. |
| AC-2.2.3 | Pricing < $200 IS penalized for Stage 1. | Submit offer with Price=50 as Stage 1. | Score penalized (low score). |

---

## Feature 3: Offer Diagnostic ("The Offer Inspector")

### AC-3.1: Scoring Engine (Universal Logic Map)
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-3.1.1 | Clarity: Headline with number/result gets +20. | Headline: "5 clients in 30 days". | Score includes Clarity bonus. |
| AC-3.1.2 | Clarity: Headline with jargon gets -20. | Headline: "Holistic synergy solutions". | Score penalized. |
| AC-3.1.3 | Avatar: Vague audience ("everyone") gets 0. | Audience: "everyone". | Avatar score = 0. |
| AC-3.1.4 | Avatar: Specific audience (>10 chars, no "everyone") gets +30. | Audience: "Dental Practice Owners in NYC". | Avatar score = +30. |

### AC-3.2: Output Structure
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-3.2.1 | Backend returns `score: Number`. | Any valid submission. | Response contains `score`. |
| AC-3.2.2 | Backend returns `stage: String`. | Any valid submission. | Response contains `stage`. |
| AC-3.2.3 | Backend returns `critique: String`. | Any valid submission. | Response contains `critique`. |
| AC-3.2.4 | Backend returns `improved_headline: String`. | Any valid submission. | Response contains `improved_headline`. |

---

## Feature 4: UI/UX Polish

### AC-4.1: No Technical Jargon
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-4.1.1 | No "Module X" labels in UI. | Navigate to all tools. | Headers say "THE OFFER INSPECTOR", not "MODULE 01". |
| AC-4.1.2 | Dashboard uses "Systems" language. | View Dashboard. | Cards say "Offer Diagnostic", not "Module 1". |

### AC-4.2: User Journey
| ID | Criterion | Test | Expected |
|---|---|---|---|
| AC-4.2.1 | Intake is mandatory first step. | Open fresh app (clear storage). | Intake modal appears first. |
| AC-4.2.2 | Dashboard appears after Intake. | Complete Intake. | "Mission Control" dashboard is visible. |
| AC-4.2.3 | Tools are accessible from Dashboard. | Click "Offer Diagnostic" card. | "THE OFFER INSPECTOR" tool opens. |

---

## Amp Instance Requirements (Backend Calls)

| Feature | Requires Amp (LLM/Backend Call)? | Reason |
|---|---|---|
| Business Intake | **NO** | Pure frontend form. Data stored in Zustand. |
| Stage Classifier | **YES** (Edge Function) | Deterministic logic but runs on `analyze-offer` backend. |
| Offer Scoring | **YES** (Edge Function) | Runs `calculateOfferScore` on backend. |
| Critique Generation | **YES** (LLM or Template) | Currently template-based (mock). Can upgrade to LLM. |
| Headline Rewriter | **YES** (LLM or Template) | Currently template-based. LLM for real personalization. |

---

## Iteration Checklist (Per Feature)

For each new feature, this checklist MUST be completed:

- [ ] **1. Define Logic:** Write AC in this file (Markdown).
- [ ] **2. Implement Backend:** If "Amp Required", create/update Edge Function.
- [ ] **3. Wire Frontend:** Connect Form -> Backend -> Result display.
- [ ] **4. Manual Test:** Use `browser_subagent` to verify happy path.
- [ ] **5. Update PRD:** Reflect changes in Technical/Non-Technical PRD.
- [ ] **6. Export to JSON:** Append AC to `acceptance_criteria.json`.
