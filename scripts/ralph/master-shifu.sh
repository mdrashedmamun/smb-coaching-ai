#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STORIES_PER_CHECKPOINT=3
MAX_CHECKPOINTS=5

echo "🧘 Master Shifu: Starting supervision"

# Pre-flight check
echo "📋 Pre-flight: Validating prd.json and environment..."
if ! jq empty "$SCRIPT_DIR/prd.json" 2>/dev/null; then
  echo "❌ Invalid prd.json format"
  exit 1
fi

if ! npm run typecheck > /dev/null 2>&1; then
  echo "⚠️  Warning: typecheck not passing. Fix before proceeding."
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  [[ ! $REPLY =~ ^[Yy]$ ]] && exit 1
fi

for checkpoint in $(seq 1 $MAX_CHECKPOINTS); do
  echo ""
  echo "═══ Checkpoint $checkpoint/$MAX_CHECKPOINTS ═══"
  
  # Count incomplete stories
  INCOMPLETE=$(jq '[.userStories[] | select(.passes == false)] | length' "$SCRIPT_DIR/prd.json")
  
  if [ "$INCOMPLETE" -eq 0 ]; then
    echo "✅ All stories complete! Master Shifu approves."
    exit 0
  fi
  
  echo "📊 Stories remaining: $INCOMPLETE"
  echo "🚀 Spawning Ralph (Claude) for $STORIES_PER_CHECKPOINT stories..."
  
  # Run Ralph (Claude-based) for N iterations
  ./"$SCRIPT_DIR/ralph.sh" $STORIES_PER_CHECKPOINT
  RALPH_EXIT=$?
  
  if [ $RALPH_EXIT -eq 0 ]; then
    echo "✅ Ralph completed all stories!"
    exit 0
  fi
  
  # Checkpoint review
  echo ""
  echo "🔍 Master Shifu: Reviewing Ralph's work..."
  
  # Check for red flags in commits
  RECENT_COMMITS=$(git log --oneline -$STORIES_PER_CHECKPOINT)
  
  if echo "$RECENT_COMMITS" | grep -qi "WIP\|TODO\|FIXME"; then
    echo "⚠️  Red flag: Found WIP/TODO in recent commits"
    echo "$RECENT_COMMITS"
    echo ""
    echo "Master Shifu suggests: Review and fix before continuing."
    read -p "Pause for manual review? (Y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Nn]$ ]] || exit 1
  fi
  
  # Check typecheck status
  if ! npm run typecheck > /dev/null 2>&1; then
    echo "❌ Typecheck failing after checkpoint $checkpoint"
    echo "Master Shifu intervention required: Fix type errors before continuing."
    exit 1
  fi
  
  echo "✅ Checkpoint $checkpoint passed. Continuing..."
  sleep 2
done

echo "⚠️  Max checkpoints reached. Review progress manually."
