# SMB Coaching AI (The "Alex" Brain) 🧠

> **Automated Investment Consultant for SMBs.**
> *Current Version: 1.0 (Phase 3 Complete)*

This application is a **Diagnostic Engine** designed to think like a $100M Investor. It analyzes a business's "Vitals" (Revenue, Profit) and "Offer" to provide stage-gated, brutally honest advice.

## 🚀 Key Features

*   **Stage-Gated Logic:** Automatically classifies businesses into `Improvise` (Stage 0), `Monetize` (Stage 1), or `Scale` (Stage 2).
*   **The Offer Inspector (Module 1):**
    *   Scores headlines based on clarity and outcome (Universal Truths).
    *   Detects "Charity Mode" (Low margins).
    *   Provides persona-based critiques (Harsh Mentor vs. Sales Director).
*   **Monolithic State:** Uses `zustand` to maintain a continuous "Business Context" across diagnostics.
*   **Edge Intelligence:** Logic resides in Supabase Edge Functions for IP protection and easy LLM swapping.

## 📚 Documentation

Detailed documentation is located in the [`docs/`](./docs) folder:

*   **[Non-Technical PRD](./docs/non_technical_prd.md):** The Vision, "Why" it exists, and User Stories.
*   **[Technical PRD](./docs/technical_prd.md):** System Architecture, Data Flow, and Stack decisions.
*   **[Universal Logic Map](./docs/universal_logic_map.md):** The comprehensive ruleset for scoring and diagnostics.
*   **[Test Scenarios](./docs/test_scenarios.md):** Real-world personas used for automated testing.
*   **[Agent Patterns](./agents.md):** Developer guide on patterns and anti-patterns.

## 🛠️ Technical Stack

*   **Frontend:** React (Vite) + TypeScript + Tailwind CSS
*   **State:** Zustand (Persistence via LocalStorage/Supabase)
*   **Backend:** Supabase (Auth, Database, Edge Functions)
*   **AI/LLM:** Gemini Pro 1.5 (via Edge Functions)

## ⚡ Quick Start

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```

3.  **Start Supabase (Back-end):**
    ```bash
    supabase start
    ```

---
*Built by Antigravity Venture Studio.*
