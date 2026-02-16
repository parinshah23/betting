#!/bin/bash
# Script to restart the frontend with environment variables

cd frontend

echo "Killing existing Next.js processes..."
pkill -f "next dev" || true

echo "Waiting for processes to stop..."
sleep 2

echo "Starting frontend with environment variables..."
npm run dev
