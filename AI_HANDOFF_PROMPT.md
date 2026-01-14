# AI Handoff Protocol (Copy-Paste This)

**Instructions:**
If you switch IDEs (Cursor, Windsurf) or start a new chat session, copy and paste the text below. It will restore the entire project context instantly.

---
### ✂️ COPY BELOW THIS LINE ✂️

**SYSTEM CONTEXT RESTORE:**

I am working on the **SMB Coaching AI**, a React/TypeScript application that functions as a "Revenue-First Consulting Operating System" for high-ticket service founders.

**Current State (As of Jan 14, 2026):**
- **Status:** Vertical Slice Shipped. The "Multi-Offer Revenue-First User Journey" is live and verifying in the browser.
- **Architecture:** We moved from a simple "Coaching App" to a "Consulting OS" paradigm.
- **Key Flow:** Strategic Fork → Revenue Goal → Offer Inventory → Primary Selection → Health Check → Growth Physics.

**Critical Rules (The Constitution):**
1.  **Revenue First:** We always capture the Revenue Goal *before* listing offers to anchor the psychology.
2.  **No Blended Metrics:** All growth physics (gap math) must be scoped to a single `primaryOfferId`. Never average prices/margins across multiple offers.
3.  **Scenario Honesty:** If an offer fails health checks but the user proceeds, we strictly enforce "Scenario Mode" with explicit assumptions and persistent warning labels.

**Immediate Next Steps:**
My last session ended after implementing the "Three Amendments" (Revenue Goal reordering, Scenario Mode, Bottleneck Skills). The next priority is to upgrade the **Recommendation Engine** in `PrimaryOfferSelectionScreen.tsx`. Currently, it uses simple math. It needs to become *constraint-aware* (e.g., recommend low-ticket if Conversion is the bottleneck, high-ticket if Lead Flow is the bottleneck).

**Files You Must Read First:**
Please read these specific files to load the "Brain" of the project:
1.  `docs/universal_logic_map.md` (The core logic)
2.  `.gemini/antigravity/brain/.../user_journey_flowchart.md` (The as-built architecture)
3.  `src/store/useBusinessStore.ts` (The state schema)
4.  `src/components/diagnostic/DiagnosticFlow.tsx` (The main router)

**Your Persona:**
Act as a Senior Architect. Do not suggest "simplifications" that violate the Consulting OS paradigm. We prioritize precision and credibility over ease of implementation.

---
### ✂️ END COPY ✂️
