Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  CareerGap AI - Development Servers      " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "Starting Python FastAPI on port 8000..." -ForegroundColor Yellow
$apiProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\api; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload" -PassThru

Write-Host "Starting Next.js Web on port 3000..." -ForegroundColor Yellow
$webProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\web; npm.cmd run dev" -PassThru

Write-Host "`nBoth services launched!" -ForegroundColor Green
Write-Host "Web Application: http://localhost:3000" -ForegroundColor White
Write-Host "FastAPI API:     http://localhost:8000/docs" -ForegroundColor White
