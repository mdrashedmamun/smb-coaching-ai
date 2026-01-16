# SMB Coaching AI - Setup Instructions

Revenue-First Consulting Operating System for high-ticket service founders.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org))
- **Git** ([Download](https://git-scm.com))
- **GitHub account** (optional, repo is public)

### Clone & Run

```bash
# 1. Clone the repository
git clone https://github.com/mdrashedmamun/smb-coaching-ai.git

# 2. Navigate to project
cd smb-coaching-ai

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

**Open browser to:** http://localhost:5173

---

## 📁 Project Structure

```
smb-coaching-ai/
├── src/
│   ├── components/
│   │   ├── diagnostic/              # User flow screens
│   │   │   ├── ConstraintCheckScreen.tsx        [NEW] Constraint assessment
│   │   │   ├── PrimaryOfferSelectionScreen.tsx  [MODIFIED] Constraint-aware recommendations
│   │   │   ├── DiagnosticFlow.tsx               [MODIFIED] Main router
│   │   │   ├── OfferInventoryScreen.tsx
│   │   │   └── ...other screens
│   │   └── ...
│   ├── lib/
│   │   ├── OfferRecommendationEngine.ts         [NEW] Constraint-aware scoring
│   │   ├── BottleneckEngine.ts                  Bottleneck detection
│   │   └── ...utilities
│   ├── store/
│   │   └── useBusinessStore.ts                  [MODIFIED] Zustand state + ConstraintSignals
│   └── main.tsx
├── .ai_workforce/
│   └── skills/                       # Canonical location for skill files
│       ├── bottleneck_conversion.md  # Conversion skill (Call→Deal)
│       └── bottleneck_follow_up.md   # Follow-up skill (Lead→Call)
├── docs/
│   ├── universal_logic_map.md       Core business logic
│   ├── technical_prd.md
│   ├── test_scenarios.md
│   └── ...
├── SETUP.md                          ← YOU ARE HERE
├── CONTEXT_RESUME.md                 Latest session context
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🧠 Key Files to Understand

### 1. **OfferRecommendationEngine.ts** - The Scoring Brain
```typescript
// Core functions:
scoreOffer()                    // Score single offer based on constraint
scoreOffers()                   // Score all offers and rank them
mapBottleneckToConstraint()     // Convert audit bottleneck to constraint type
inferConstraint()               // Map quick-check responses to constraint
```

**What it does:**
- Scores offers RELATIVE to user's portfolio (no hardcoded thresholds)
- Returns recommendation badges, deal counts, and tags
- Only shows calls/month when we have real close rate data
- Handles all portfolio sizes (safe quartile calculation)

### 2. **useBusinessStore.ts** - State Management
```typescript
// New interface:
ConstraintSignals {
  primaryConstraint:   'lead_flow' | 'conversion' | 'delivery_capacity' | 'retention' | null
  confidenceLevel:     'high' | 'medium' | 'low'
  source:              'prior_audit' | 'quick_check' | 'inferred'
  metadata: {
    q1_demandBreakpoint?: string
    q2_hardestPart?: string
    q3_callCapacity?: number
  }
  timestamp: number
}

// New action:
setConstraintSignals(signals: ConstraintSignals): void
```

### 3. **DiagnosticFlow.tsx** - The Router
```
Strategic Fork
  ↓ [bucket selected]
Offer Intro
  ↓ [complete]
Revenue Goal
  ↓ [set]
Offer Inventory
  ↓ [offers added]
Constraint Check      ← [NEW] Auto-skip if returning user
  ↓ [answers given]
Primary Offer Selection  ← [UPGRADED] Uses constraint-aware scoring
  ↓ [selected]
Health Check
  ↓ ...rest of flow
```

### 4. **ConstraintCheckScreen.tsx** - New User Micro-Assessment
```typescript
// 2-3 question screen that asks:
Q1: "If demand doubled next week, what would break first?"
    → lead_flow | sales | delivery | not_sure

Q2: "Which feels harder right now?"
    → getting_leads | booking_calls | closing | retention

Q3: (optional) "How many sales calls per week?"
    → numeric input
```

---

## 🎯 Current Architecture

### User Journey
```
1. Strategic Fork
   User selects bucket (high_ticket_service, saas, etc)

2. Offer Intro
   Context: "You're a Revenue-First business"

3. Revenue Goal
   "Current monthly: $X | Target in 90 days: $Y"

4. Offer Inventory
   "Add your offers: name, price, type"

5. Constraint Check ← [NEW]
   Quick assessment of their biggest bottleneck

6. Primary Offer Selection ← [UPGRADED]
   Recommendations based on constraint
   - Recommendation badges ("Recommended for Lead Flow")
   - Relative leverage tags (portfolio quartiles)
   - Transparent close rate labels

7. Health Check → Data Recap → Lead Audit
```

### Constraint Mapping
```
Bottleneck (from Lead Audit)    →    Constraint (for Recommendations)
─────────────────────────────────────────────────────────────────
volume_outreach                 →    lead_flow
volume_followup                 →    conversion
skill_messaging                 →    conversion
skill_sales                     →    conversion
price                           →    conversion
capacity                        →    delivery_capacity
```

### Recommendation Logic
```
IF constraint = lead_flow
  RECOMMEND: High-ticket offers (minimize deals needed)
  TAG: "Recommended for Lead Flow" (if deals/month ≤ Q1)

IF constraint = conversion
  RECOMMEND: Lowest-priced offer in portfolio
  TAG: "Recommended for Conversion"

IF constraint = delivery_capacity
  RECOMMEND: High-ticket offers (fewer clients)
  TAG: "Capacity-Friendly"

IF constraint = retention
  RECOMMEND: Retainer/consulting offers
  TAG: "LTV Expansion Path"
```

---

## 📊 Verification Tests (All Passing ✅)

### Test 1: Conversion Constraint with Portfolio Context
```
Offers: $500, $2,500, $10,000 | Constraint: conversion
Expected: $500 offer gets "Recommended for Conversion" badge
Status: ✅ PASS (no hardcoded $2K threshold)
```

### Test 2: New User (No Close Rate Data)
```
confidence='medium' | No prior audit
Expected: Shows "deals/month" but NOT "calls/month"
Status: ✅ PASS (transparent, no speculation)
```

### Test 3: Returning User (Real Close Rate)
```
confidence='high' | Close rate: 35%
Expected: Shows "calls/month" labeled "Based on your 35% close rate"
Status: ✅ PASS (data-driven)
```

### Test 4: High Leverage Tag (Relative)
```
Offers: $1K, $3K, $5K, $10K | Gap: $20K/mo
Deals: 20, 6.67, 4, 2
Expected: $10K="High Leverage", $1K="Volume Heavy" (quartile-based)
Status: ✅ PASS (works for all portfolio sizes)
```

### Test 5: Bottleneck Mapping (Price → Conversion)
```
Prior bottleneck: 'price' → Constraint: 'conversion'
Expected: Lowest-priced offer recommended
Status: ✅ PASS (correct paradigm)
```

---

## 🛠 Common Commands

```bash
# Development
npm run dev          # Start dev server (hot reload)
npm run build        # Production build
npm run preview      # Preview production build locally

# Linting & Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types

# Git Workflow
git status           # See what changed
git add .            # Stage all changes
git commit -m "..."  # Create commit
git push origin main # Push to GitHub
```

---

## 🔧 Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework | 18.x |
| TypeScript | Type safety | 5.x |
| Vite | Build tool | 5.x |
| Tailwind CSS | Styling | 3.x |
| Zustand | State management | 4.x |
| Framer Motion | Animations | 10.x |
| Supabase | Backend (optional) | - |

---

## 📝 Configuration Files

### `vite.config.ts`
Development server port and build settings. Default: `http://localhost:5173`

### `tsconfig.json`
TypeScript compiler configuration. Strict mode enabled.

### `.env.example` (Create `.env` from this)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### `package.json`
Dependencies and scripts. Don't edit manually - use `npm install package-name`.

---

## 🚨 Troubleshooting

### Port 5173 Already in Use
```bash
# Option 1: Use different port
npm run dev -- --port 3000

# Option 2: Kill process using port
lsof -i :5173
kill -9 <PID>
```

### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Clear TypeScript cache
rm -rf node_modules/.vite
npm install
```

### Tailwind Not Applying
```bash
# Rebuild Tailwind
npm install
npm run dev
```

### Hot Reload Not Working
- Check file is saved
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## 📚 Documentation

### Core Logic
- **`docs/universal_logic_map.md`** - Business logic (stages, constraints, diagnostics)
- **`docs/technical_prd.md`** - Technical product requirements
- **`docs/test_scenarios.md`** - Test cases and user flows

### Context & Status
- **`CONTEXT_RESUME.md`** - Latest session context and next priorities
- **`README.md`** - Project overview

### This File
- **`SETUP.md`** - Setup instructions (you are here)

---

## 🔄 Workflow for New IDEs/Machines

### Starting Fresh (New Machine)
```bash
# 1. Install Node.js and Git (if not installed)

# 2. Clone repository
git clone https://github.com/mdrashedmamun/smb-coaching-ai.git

# 3. Install dependencies
cd smb-coaching-ai
npm install

# 4. Start development
npm run dev

# 5. Create .env file (if using Supabase)
# Copy from .env.example and fill in credentials
```

### Resuming Work
```bash
# 1. Navigate to project
cd smb-coaching-ai

# 2. Get latest changes
git pull origin main

# 3. Install any new dependencies
npm install

# 4. Start development
npm run dev
```

### Pushing Changes
```bash
# 1. Check what changed
git status

# 2. Stage changes
git add .

# 3. Commit with message
git commit -m "feat: description of change"

# 4. Push to GitHub
git push origin main
```

---

## ☁️ Backup & Safety

### Your Code is Always Safe ✅
- **GitHub is your backup**: Every commit is saved
- **Public repo**: Anyone can clone it
- **No dependencies on local files**: Everything is in Git

### Never Lose Work
1. Commit regularly: `git commit -m "..."`
2. Push to GitHub: `git push origin main`
3. Clone anywhere: `git clone https://github.com/mdrashedmamun/smb-coaching-ai.git`

### If HD Crashes
```bash
# Get new machine with Node.js + Git installed
git clone https://github.com/mdrashedmamun/smb-coaching-ai.git
cd smb-coaching-ai
npm install
npm run dev
```
**Total time: ~10 minutes** ✨

---

## 🆘 Getting Help

### Common Issues
1. **Port already in use** → Use `npm run dev -- --port 3000`
2. **Dependencies not installing** → `rm -rf node_modules && npm install`
3. **TypeScript errors** → Run `npm run type-check` and check errors
4. **Tailwind not working** → Rebuild with `npm run dev`

### References
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com
- **Zustand Docs**: https://github.com/pmndrs/zustand

### Project Resources
- **GitHub Issues**: https://github.com/mdrashedmamun/smb-coaching-ai/issues
- **GitHub Discussions**: https://github.com/mdrashedmamun/smb-coaching-ai/discussions
- **Docs**: See `/docs` folder

---

## ✨ Latest Changes

**Commit:** `7d8b2ac`
**Date:** Jan 14, 2026
**Theme:** Constraint-Aware Recommendation Engine

### New Files
- `src/lib/OfferRecommendationEngine.ts` - Scoring engine
- `src/components/diagnostic/ConstraintCheckScreen.tsx` - Constraint assessment

### Modified Files
- `src/store/useBusinessStore.ts` - Added ConstraintSignals
- `src/components/diagnostic/PrimaryOfferSelectionScreen.tsx` - Integrated scoring
- `src/components/diagnostic/DiagnosticFlow.tsx` - Added routing

### Key Features
✅ Constraint-aware scoring (no hardcoded thresholds)
✅ Relative leverage tagging (portfolio quartiles)
✅ Transparent calls/month (real data only)
✅ Correct bottleneck mapping
✅ All 5 verification tests passing

---

## 🎯 Next Steps

1. **Test in Browser**
   - Complete user flow
   - Answer constraint check questions
   - Verify recommendations update

2. **Add Features** (suggested)
   - Analytics/tracking
   - Export recommendations
   - A/B test different constraints
   - Add new constraint types

3. **Integrate Backend**
   - Connect to Supabase
   - Store constraint signals
   - Track recommendation outcomes

4. **Launch Features**
   - Show to beta users
   - Collect feedback
   - Iterate on scoring

---

**Happy coding! 🚀**

For questions or issues, see the GitHub repository or check the `/docs` folder for detailed documentation.
