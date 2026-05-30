# Delivery System - Bilow labada qaybood
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\DeliverySystem.Api'; dotnet run"

Start-Sleep -Seconds 5

Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "Backend:  http://localhost:5119" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Fur browser: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Login: admin@delivery.com / Admin@123"
