#!/usr/bin/env bash
set -e

echo "========================================="
echo "  CareerGap AI - Database Migration & Seed"
echo "========================================="

cd apps/web
echo "1. Synchronizing Prisma Database Schema..."
npx prisma db push

echo "2. Seeding 15 Industry Roles, Resources, and Demo User..."
node --experimental-strip-types prisma/seed.ts
cd ../..

echo "\nDatabase initialized and seeded successfully!"
