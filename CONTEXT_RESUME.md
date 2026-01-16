# Project Recovery & Resume Manual
**Timestamp:** 2026-01-14 (Post-Amendment 4 Ship)
**Status:** Consulting OS Vertical Slice Complete

## 1. Where is the Project?
**Root Directory:**
`/Users/md.rashedmamun/Claude Code Projects/Antigravity Venture Studio/smb-coaching-ai`

**Git State:**
- Branch: `main`
- Last Commit: `b7c9b0f` ("feat: Implement Multi-Offer Revenue-First Journey...")
- Status: Clean (All changes committed)

## 2. How to Resume Work (Any IDE)
1.  **Open the Folder:** Open the root directory in VS Code, Cursor, or Zed.
2.  **Install/Verify Dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Dev Server:**
    ```bash
    npm run dev
    ```
4.  **Verify the Build:**
    Go to `http://localhost:5173`. You should see the "Three Silent Killers" intro.

## 3. Immediate Context for Next Session
We have just finished transitioning from a "Coaching App" to a **"Revenue-First Consulting OS"**.

**Completed & Verified:**
- ✅ **Revenue-First Flow:** Intro → Goal → Inventory → Selection → Health Check
- ✅ **Scenario Mode:** Fail screens allow "Run Scenario" with explicit assumptions.
- ✅ **Constraint Routing:** Bottlenecks route to `bottleneck_lead_flow.md` etc.
- ✅ **Constitution:** `RevenueGoalScreen.tsx` contains the "No Blended Metrics" rule.
- ✅ **Recommendation Engine:** Constraint-aware scoring with relative leverage tags.

**Next Priority:**
1. **Browser Verification:** Manually verify the complete user flow, specifically the constraint check and recommendation logic.
2. **Feature Additions:** Implement analytics/tracking and recommendation exports.
3. **Backend Integration:** Connect to Supabase for signal storage.

## 4. Critical Architecture Rules (Do Not Break)
1.  **Revenue Goal First:** Always anchor the user to a number before asking for inventory.
2.  **Primary Offer Scope:** All physics/gap math must be calculated against `primaryOfferId`. **NO BLENDED METRICS.**
3.  **Scenario Honesty:** Never allow a user to bypass a fail state without explicit "Scenario Mode" warnings.

## 5. Key Files
- **Brain/Logic:** `docs/universal_logic_map.md`
- **Flowchart:** `.gemini/antigravity/brain/.../user_journey_flowchart.md` (See Artifacts)
- **Skill Playbooks:** `.ai_workforce/skills/*.md`
