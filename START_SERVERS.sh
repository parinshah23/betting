#!/bin/bash

echo "🚀 Starting Gambling Web Platform..."
echo ""

# Kill any existing processes
echo "Cleaning up old processes..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2

# Start backend
echo "📦 Starting Backend..."
cd /home/kevin/Desktop/gambling-web/backend
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 5

# Check if backend started
if curl -s http://localhost:3001/api/competitions > /dev/null 2>&1; then
  echo "✅ Backend running on http://localhost:3001"
else
  echo "❌ Backend failed to start! Check /tmp/backend.log"
  tail -20 /tmp/backend.log
  exit 1
fi

# Start frontend
echo ""
echo "🎨 Starting Frontend..."
cd /home/kevin/Desktop/gambling-web/frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 5

# Check if frontend started
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Frontend running on http://localhost:3000"
else
  echo "❌ Frontend failed to start! Check /tmp/frontend.log"
  tail -20 /tmp/frontend.log
  exit 1
fi

echo ""
echo "🎉 All servers running!"
echo ""
echo "📝 Test accounts:"
echo "  - user1@test.com / Admin123! (has wins + tickets)"
echo "  - admin@test.com / Admin123!"
echo ""
echo "🌐 Open: http://localhost:3000"
echo ""
echo "📊 View logs:"
echo "  - Backend: tail -f /tmp/backend.log"
echo "  - Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "  - Kill backend: kill $BACKEND_PID"
echo "  - Kill frontend: kill $FRONTEND_PID"
echo "  - Or: lsof -ti:3001 | xargs kill -9 && lsof -ti:3000 | xargs kill -9"
echo ""
