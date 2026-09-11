@echo off
echo ========================================
echo   VERITAS BANK V2 - Simple Setup
echo ========================================
echo.

echo Step 1: Installing Backend...
cd backend
copy .env.example .env
call npm install
if errorlevel 1 goto error

echo.
echo Step 2: Setting up Database...
call npx prisma generate
call npx prisma migrate dev --name init
call npm run prisma:seed

echo.
echo Step 3: Installing Frontend...
cd ..\frontend
call npm install
if errorlevel 1 goto error

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the app, run: start.bat
echo.
pause
exit

:error
echo.
echo ERROR: Something went wrong!
echo Please check the error above.
pause
