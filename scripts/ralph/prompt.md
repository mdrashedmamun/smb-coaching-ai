# Ralph Agent Instructions - SMB Coaching AI

## Your Task

1. Read `scripts/ralph/prd.json`
2. Read `scripts/ralph/progress.txt` (**Codebase Patterns section FIRST**)
3. Verify you're on the branch specified in `prd.json.branchName`
4. Pick the highest priority story where `passes: false` (lowest priority number)
5. Implement **ONLY THAT ONE STORY**
6. Run quality checks:
   ```bash
   npm run typecheck
   npm run test
   ```
7. If checks pass:
   - Update relevant `AGENTS.md` files with reusable learnings
   - Commit: `feat: [story.id] - [story.title]`
   - Update `prd.json`: set `passes: true` for this story
   - Append learnings to `progress.txt`
8. If checks fail:
   - Fix and retry (up to 2 attempts)
   - If still failing, document in progress.txt and move to next story

## Progress Format

**APPEND** to `progress.txt`:

\`\`\`markdown
## [YYYY-MM-DD] - [Story ID]
**Implemented:** [Brief description]
**Files Changed:** [List files]
**Learnings:**
- [Pattern discovered]
- [Gotcha encountered]
- [Useful context for future iterations]
---
\`\`\`

## Codebase Patterns

Before starting, check the **"## Codebase Patterns"** section at the TOP of `progress.txt`.
These are accumulated learnings from all previous iterations.

## AGENTS.md Updates

For each file you edit, check if there's an `AGENTS.md` in that directory.
If you discover reusable patterns/gotchas, update it.

## UI Stories: Browser Verification

If acceptance criteria includes "Verify in browser":
1. Start dev server: `npm run dev &`
2. Load/Use browser tool
3. Navigate to the page
4. Take screenshot to `tmp/screenshot-[story-id].png`
5. Verify criteria met visually
6. NOT complete until screenshot confirms success

## Stop Condition

If ALL stories have `passes: true`, output EXACTLY:
\`\`\`
<promise>COMPLETE</promise>
\`\`\`
