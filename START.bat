@echo off
title Delivery System - Start
echo Starting Delivery System...
echo.

start "Backend API" cmd /k "cd /d "%~dp0backend\DeliverySystem.Api" && dotnet run"
timeout /t 5 /nobreak >nul
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Backend:  http://localhost:5119
echo Frontend: http://localhost:5173
echo.
echo Labada daaqadood ha xidhin! Kadib fur browser: http://localhost:5173
pause
