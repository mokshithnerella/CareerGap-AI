Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  CareerGap AI - Automated Test Suite    " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Run Python Backend Pytest Suite
Write-Host "`n[1/2] Running Python Backend Tests (Pytest)..." -ForegroundColor Yellow
Push-Location -Path "services\api"
python -m pytest tests/ -v
$pyExit = $LASTEXITCODE
Pop-Location

# 2. Run TypeScript Frontend Vitest Suite
Write-Host "`n[2/2] Running Frontend Unit & Journey Tests (Vitest)..." -ForegroundColor Yellow
Push-Location -Path "apps\web"
npx.cmd vitest run
$tsExit = $LASTEXITCODE
Pop-Location

if ($pyExit -eq 0 -and $tsExit -eq 0) {
    Write-Host "`nAll test suites passed successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nTest failures detected." -ForegroundColor Red
    exit 1
}
