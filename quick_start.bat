@echo off
echo 🚀 Resume Builder Quick Start
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Seeding database with sample jobs...
call npm run seed

echo.
echo Step 3: Building and starting server...
start cmd /k "npm run server"

echo.
echo Step 4: Starting frontend (will open in new window)...
timeout /t 3 /nobreak
start cmd /k "npm run dev"

echo.
echo ✅ Setup complete!
echo.
echo 📖 Open your browser to: http://localhost:5173
echo 🔧 Server API: http://localhost:5000
echo 📊 System Status: http://localhost:5000/api/debug/status
echo.
echo Press any key to exit...
pause
