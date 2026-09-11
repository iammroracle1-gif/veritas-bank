@echo off
echo ============================================
echo    VERITAS BANK V2.0 - Starting Servers
echo ============================================
echo.

echo Starting Backend Server...
start "Veritas Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Veritas Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo    Servers Starting...
echo ============================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Open your browser to: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
