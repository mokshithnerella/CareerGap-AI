Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  CareerGap AI - Database Migration & Seed" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Push-Location -Path "apps\web"
Write-Host "1. Synchronizing Prisma Database Schema..." -ForegroundColor Yellow
npx.cmd prisma db push

Write-Host "2. Seeding 15 Industry Roles, Resources, and Demo User..." -ForegroundColor Yellow
node --experimental-strip-types prisma/seed.ts
Pop-Location

Write-Host "`nDatabase initialized and seeded successfully!" -ForegroundColor Green
