#!/bin/bash
set -e

echo "=== Speak Coach Production Deploy (Phase 15) ==="

# Validate env
bash scripts/validate-env.sh

API_URL="${NEXT_PUBLIC_API_URL:-https://speak-coach-api.workers.dev}"
PAGES_PROJECT="${PAGES_PROJECT:-speak-coach}"

echo ""
echo "Using API_URL=$API_URL"
echo "Using PAGES_PROJECT=$PAGES_PROJECT"

# Apply remote migrations
echo ""
echo ">>> Applying D1 migrations (remote)..."
cd workers/api
npx wrangler d1 migrations apply speak-coach --remote

# Seed remote DB (idempotent)
echo ">>> Seeding remote database..."
npx wrangler d1 execute speak-coach --remote --file=./src/db/seed.sql || true
npx wrangler d1 execute speak-coach --remote --file=./src/db/seed_phase6.sql || true
npx wrangler d1 execute speak-coach --remote --file=./src/db/seed_phase15.sql || true
cd ../..

# Deploy Worker API
echo ""
echo ">>> Deploying Worker API..."
npm run deploy -w @speak-coach/api

# Build static frontend.
# API is served same-origin via the Pages Function proxy (apps/web/functions/api),
# so the client uses relative /api/* URLs and auth cookies stay first-party.
echo ""
echo ">>> Building frontend (static export, same-origin API)..."
NEXT_PUBLIC_API_URL="" \
  npm run build -w @speak-coach/web

# Deploy to Cloudflare Pages
echo ""
echo ">>> Deploying to Cloudflare Pages..."
cd apps/web
npx wrangler pages deploy out --project-name="$PAGES_PROJECT"
cd ../..

# Smoke test deployed API
echo ""
echo ">>> Running smoke tests..."
API_URL="$API_URL" \
  bash scripts/smoke-test.sh

echo ""
echo "=== Deploy Complete ==="
echo "API:  $API_URL"
echo "Web:  https://${PAGES_PROJECT}.pages.dev"
echo ""
echo "Next steps:"
echo "  1. Open https://${PAGES_PROJECT}.pages.dev/launch for launch checklist"
echo "  2. Install PWA from browser menu"
echo "  3. Set daily reminder in Settings"
