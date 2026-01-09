# Technical PRD: The SMB Coaching AI (Alex Brain)

> **Version:** 1.0 (End of Phase 3)
> **Stack:** React (Vite), TypeScript, Tailwind, Zustand, Supabase (Auth + DB + Edge Functions).

---

## 1. System Architecture

### A. Frontend (The Interface)
*   **Framework:** React + Vite (SPA).
*   **State Management:** `zustand`. We use a monolithic store `useBusinessStore.ts` to hold the entire "Business Context". This serves as the "RAM" for the diagnostic session.
    *   *Why Monolithic?* The diagnostic steps are interdependent. Module 2 needs data from Module 1. A single source of truth prevents sync issues.
*   **UI Library:** Tailwind CSS (Custom "Space/Futuristic" theme). Components are built for "calm authority" (Glassmorphism).

### B. Backend (The Logic Layer)
*   **Platform:** Supabase.
*   **Edge Functions (Deno):** The core intelligence lives here, NOT in the frontend.
    *   **Function:** `analyze-offer`.
    *   *Why Backend?* To protect the "System Prompts" and proprietary scoring logic (IP protection). It also allows us to switch LLM providers (Gemini/OpenAI) without redeploying the frontend.
*   **Database:** PostgreSQL (`businesses` table). Stores the persisted state of `useBusinessStore`.

---

## 2. Core Data Flow (The "Offer Diagnostic" Pipeline)

### Step 1: Input Collection (`BusinessIntake.tsx`)
We collect data into two buckets in the Store:
*   **Identity**: `businessName`, `type`
*   **Vitals**: `revenue`, `profit`, `margin` (auto-calculated: `profit / revenue * 100`)
*   **Goals ("North Star")**: `revenue1Year`, `primaryConstraint`

### Step 2: The Payload Construction (`Module1/index.tsx`)
When the user clicks "Analyze", the frontend constructs a specific payload:
```typescript
const payload = {
    offer: { ... },
    vitals: { revenue: 100000 }, // CRITICAL for Stage Classifer
    goals: { revenue1Year: 1000000 } // CRITICAL for Gap Analysis
}
```

### Step 3: The Advisory Brain (`analyze-offer/index.ts`)
This is the heart of the system.
1.  **Stage Classifier**: It checks `payload.vitals.revenue`.
    *   `$0` -> Assigns **Stage 0** logic.
    *   `>$0` -> Assigns **Stage 1** logic.
2.  **Scoring Engine**: Runs deterministic regex checks per `universal_logic_map.md`.
    *   **Clarity**: +20 for numbers, -20 for jargon.
    *   **Avatar**: +30 for specificity, 0 for "everyone".
    *   **Pricing**: Stage-dependent (+30 for high-ticket in Stage 1, +40 for free in Stage 0).
    *   *Example:* If Stage 0, `price === 0` gets +40 points. If Stage 1, `price === 0` gets -50 points.
3.  **Persona Injection**: It selects the System Prompt based on Stage.
    *   *Stage 0 Prompt:* "You are a Harsh Mentor. Tell them to work for free."
    *   *Stage 1 Prompt:* "You are a Sales Director. Tell them to raise prices."
4.  **Strategic AI Advisor (Phase 6)**: Qualitative LLM analysis that checks for "Semantic Fit" between traffic, offer, and audience.

### Step 4: The Response
The Edge Function returns:
*   `score`: Number (e.g. 45)
*   `stage`: String (e.g. "Monetize")
*   `critique`: "Your offer is invisible..."
*   `prescription`: "Raise price to $500..."

---

## 3. Key Technical Decisions & Guardrails
### Phase 6: Qualitative Strategic Advisor [COMING SOON]
- **Semantic Audit:** AI checks if the "Message" on the ad matches the "Promise" on the landing page.
- **The Hormone-Coach Persona:** Tone of voice is direct, tactical, and result-oriented (No fluff).
- **Context-Aware Coaching:** Advice changes based on the founder's hours worked and months of cash.
*   **Deterministic vs Probabilistic:**
    *   **Scoring** is Deterministic (Code). It ensures consistency.
    *   **Critique** is Probabilistic (LLM). It adds flavor and nuance.
*   **Fail-Safe:** If the LLM is down, the Scoring Engine still returns a numerical score and a hard-coded "Fallback Critique" based on the score bucket.

---

## 4. Testing Strategy (Phase 3 Updates)
**"Mock Mode" Pattern:**
To validate logic without incurring Edge Function costs or latency during development, we use a `MOCK_MODE` flag in the frontend components (e.g., `Module1/index.tsx`). 
*   **Dev Logic:** The "Universal Logic" is temporarily mirrored in the frontend for rapid iteration.
*   **Prod Logic:** Once validated (via `browser_subagent`), the logic is ported to the `analyze-offer` Edge Function.
*   **Validation:** Use `test_scenarios.md` to run automated browser tests against the Mock Mode before deployment.

---

## 5. Handover Checklist (For Developers)

1.  **Environment Variables:** Ensure `SUPABASE_URL`, `SUPABASE_KEY`, and `GEMINI_API_KEY` are set in the Edge Function secrets.
2.  **Deployment:** Run `supabase functions deploy analyze-offer`.
3.  **Authentication:** The Store handles `syncToSupabase` automatically. Ensure RLS policies on the `businesses` table allow users to read/write their own rows.
