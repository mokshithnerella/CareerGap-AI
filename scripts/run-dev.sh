#!/usr/bin/env bash

echo "========================================="
echo "  CareerGap AI - Development Servers      "
echo "========================================="

cleanup() {
    echo "\nTerminating background services..."
    kill $API_PID $WEB_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

echo "Starting Python FastAPI on port 8000..."
(cd services/api && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload) &
API_PID=$!

echo "Starting Next.js Web on port 3000..."
(cd apps/web && npm run dev) &
WEB_PID=$!

echo "\nServices active!"
echo "Web App: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"

wait
