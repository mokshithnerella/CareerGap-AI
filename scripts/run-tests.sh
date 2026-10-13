#!/usr/bin/env bash
set -e

echo "========================================="
echo "  CareerGap AI - Automated Test Suite    "
echo "========================================="

echo "\n[1/2] Running Python Backend Tests (Pytest)..."
cd services/api
python -m pytest tests/ -v
cd ../..

echo "\n[2/2] Running Frontend Unit & Journey Tests (Vitest)..."
cd apps/web
npx vitest run
cd ../..

echo "\nAll test suites passed successfully!"
