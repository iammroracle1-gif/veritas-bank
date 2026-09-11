@echo off
cls
echo ============================================
echo    VERITAS BANK V2.0 - First Time Setup
echo ============================================
echo.
echo This script will help you set up Veritas Bank V2.0
echo.
echo Prerequisites Check:
echo - Node.js 18+ must be installed
echo - PostgreSQL 14+ must be installed
echo - Database 'veritas_bank' must be created
echo.
pause

echo.
echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Setting up Backend Environment...
if not exist .env (
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env file and set your PostgreSQL password
    echo Press any key after editing .env file...
    pause > nul
)

echo.
echo [3/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [4/4] Initializing Database...
cd ..\backend
call npx prisma generate
call npx prisma migrate dev --name init
call npm run prisma:seed

echo.
echo ============================================
echo    Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo 1. Double-click 'start.bat' to run the application
echo 2. Open http://localhost:5173 in your browser
echo 3. Login with demo credentials:
echo    - Admin: admin@veritasbank.com / Admin@123
echo    - User: user@veritasbank.com / User@123
echo.
echo Press any key to exit...
pause > nul
