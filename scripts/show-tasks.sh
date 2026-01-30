#!/bin/bash

# Human Developer Tasks Display Script
# Run this script to see pending tasks in the terminal

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TASKS_FILE="$PROJECT_ROOT/human_developer.md"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Parse arguments
FILTER_PHASE=""
SHOW_PENDING_ONLY=false
SHOW_COMPLETED=false

for arg in "$@"; do
    case $arg in
        --phase=*)
            FILTER_PHASE="${arg#*=}"
            ;;
        --pending)
            SHOW_PENDING_ONLY=true
            ;;
        --completed)
            SHOW_COMPLETED=true
            ;;
        --help|-h)
            echo "Usage: ./show-tasks.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --phase=N     Filter by phase number (0-5)"
            echo "  --pending     Show only pending tasks"
            echo "  --completed   Show only completed tasks"
            echo "  --help, -h    Show this help message"
            exit 0
            ;;
    esac
done

clear

echo ""
echo -e "${BOLD}${CYAN}================================================${NC}"
echo -e "${BOLD}${CYAN}     RAFFLE COMPETITION PLATFORM - TASKS        ${NC}"
echo -e "${BOLD}${CYAN}================================================${NC}"
echo ""

# Check if tasks file exists
if [ ! -f "$TASKS_FILE" ]; then
    echo -e "${RED}Error: human_developer.md not found!${NC}"
    exit 1
fi

# Count tasks
TOTAL_TASKS=$(grep -c '\- \[ \]' "$TASKS_FILE" 2>/dev/null || echo 0)
COMPLETED_TASKS=$(grep -c '\- \[x\]' "$TASKS_FILE" 2>/dev/null || echo 0)
PENDING_TASKS=$((TOTAL_TASKS))

echo -e "${BOLD}Quick Status:${NC}"
echo -e "  ${GREEN}Completed:${NC} $COMPLETED_TASKS tasks"
echo -e "  ${YELLOW}Pending:${NC}   $PENDING_TASKS tasks"
echo -e "  ${BLUE}Total:${NC}     $((COMPLETED_TASKS + PENDING_TASKS)) tasks"
echo ""

# Show phase status
echo -e "${BOLD}Phase Progress:${NC}"
echo -e "  Phase 0: Planning & Documentation  ${GREEN}[COMPLETE]${NC}"

phase1_done=$(grep -c '\[x\].*TASK-1[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
phase1_total=$(grep -c 'TASK-1[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
echo -e "  Phase 1: Database & Schemas        [$phase1_done/$phase1_total]"

phase2_done=$(grep -E '\[x\].*TASK-2[0-9]+' "$TASKS_FILE" 2>/dev/null | wc -l | tr -d ' ')
phase2_total=$(grep -E 'TASK-2[0-9]+:' "$TASKS_FILE" 2>/dev/null | wc -l | tr -d ' ')
echo -e "  Phase 2: Backend API & Auth        [$phase2_done/$phase2_total]"

phase3_done=$(grep -c '\[x\].*TASK-3[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
phase3_total=$(grep -c 'TASK-3[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
echo -e "  Phase 3: Frontend Skeleton         [$phase3_done/$phase3_total]"

phase4_done=$(grep -c '\[x\].*TASK-4[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
phase4_total=$(grep -c 'TASK-4[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
echo -e "  Phase 4: Page Implementation       [$phase4_done/$phase4_total]"

phase5_done=$(grep -c '\[x\].*TASK-5[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
phase5_total=$(grep -c 'TASK-5[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
echo -e "  Phase 5: Testing & Polish          [$phase5_done/$phase5_total]"

echo ""
echo -e "${BOLD}${CYAN}------------------------------------------------${NC}"
echo ""

# Show next tasks
echo -e "${BOLD}${YELLOW}NEXT TASKS TO COMPLETE:${NC}"
echo ""

# Pre-implementation tasks
echo -e "${BOLD}Pre-Implementation Setup (HUMAN REQUIRED):${NC}"
grep -E '^\- \[ \].*TASK-00[0-9]' "$TASKS_FILE" | head -10 | while read line; do
    task_id=$(echo "$line" | grep -oE 'TASK-[0-9]+')
    task_desc=$(echo "$line" | sed 's/.*\*\*TASK-[0-9]*:\*\* //')
    echo -e "  ${RED}[ ]${NC} ${CYAN}$task_id${NC}: $task_desc"
done

echo ""

# Phase 1 tasks
if [ -z "$FILTER_PHASE" ] || [ "$FILTER_PHASE" = "1" ]; then
    echo -e "${BOLD}Phase 1 - Database & Schemas:${NC}"
    grep -E '^\- \[ \].*TASK-1[0-9][0-9]' "$TASKS_FILE" | head -5 | while read line; do
        task_id=$(echo "$line" | grep -oE 'TASK-[0-9]+')
        task_desc=$(echo "$line" | sed 's/.*\*\*TASK-[0-9]*:\*\* //')
        echo -e "  ${RED}[ ]${NC} ${CYAN}$task_id${NC}: $task_desc"
    done
    remaining=$(grep -c '^\- \[ \].*TASK-1[0-9][0-9]' "$TASKS_FILE" 2>/dev/null || echo 0)
    if [ "$remaining" -gt 5 ]; then
        echo -e "  ${YELLOW}... and $((remaining - 5)) more tasks${NC}"
    fi
    echo ""
fi

# Phase 2 tasks
if [ -z "$FILTER_PHASE" ] || [ "$FILTER_PHASE" = "2" ]; then
    echo -e "${BOLD}Phase 2 - Backend API & Auth:${NC}"
    grep -E '^\- \[ \].*TASK-2[0-9]+' "$TASKS_FILE" | head -5 | while read line; do
        task_id=$(echo "$line" | grep -oE 'TASK-[0-9]+')
        task_desc=$(echo "$line" | sed 's/.*\*\*TASK-[0-9]*:\*\* //')
        echo -e "  ${RED}[ ]${NC} ${CYAN}$task_id${NC}: $task_desc"
    done
    remaining=$(grep -E '^\- \[ \].*TASK-2[0-9]+' "$TASKS_FILE" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$remaining" -gt 5 ]; then
        echo -e "  ${YELLOW}... and $((remaining - 5)) more tasks${NC}"
    fi
    echo ""
fi

echo -e "${BOLD}${CYAN}------------------------------------------------${NC}"
echo ""
echo -e "View full task list: ${BLUE}cat human_developer.md${NC}"
echo -e "Filter by phase:     ${BLUE}./scripts/show-tasks.sh --phase=1${NC}"
echo ""
