#!/bin/bash

# Pre-commit verification script for gambling-web project
# This script should be run before committing any code changes
# AI agents should run this after making modifications

set -e

echo "🔍 Running Code Quality Checks..."
echo "================================="

# Navigate to frontend
cd "$(dirname "$0")/../../frontend" || exit 1

echo ""
echo "📋 Step 1: ESLint Check"
echo "-----------------------"
npm run lint
if [ $? -eq 0 ]; then
    echo "✅ ESLint: PASSED"
else
    echo "❌ ESLint: FAILED"
    echo "Run 'npm run lint' in frontend/ to see errors"
    exit 1
fi

echo ""
echo "📋 Step 2: TypeScript Check"
echo "---------------------------"
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ TypeScript: PASSED"
else
    echo "❌ TypeScript: FAILED"
    echo "Run 'npx tsc --noEmit' in frontend/ to see errors"
    exit 1
fi

echo ""
echo "📋 Step 3: Build Check"
echo "----------------------"
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build: PASSED"
else
    echo "❌ Build: FAILED"
    exit 1
fi

echo ""
echo "================================="
echo "✅ All checks passed!"
echo "================================="
