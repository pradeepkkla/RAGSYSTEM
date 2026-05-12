@echo off
echo ==========================================
echo Starting Enterprise RAG Framework...
echo ==========================================

echo.
echo [1/4] Installing Backend Dependencies...
cd backend
call npm install

echo.
echo [2/4] Installing Frontend Dependencies...
cd ..
call npm install

echo.
echo [3/4] Building Frontend...
call npm run build

echo.
echo [4/4] Launching Full Website on Port 5000...
echo Starting Server...
start cmd /k "title Full Website (Port 5000) && cd backend && node server.js"

echo.
echo Done! Your full website will be available at http://localhost:5000
echo It might take a moment to start up.
pause
