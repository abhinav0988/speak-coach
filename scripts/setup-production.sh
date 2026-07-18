#!/bin/bash
# One-time production resource setup for Speak Coach on Cloudflare
set -e

echo "=== Speak Coach Production Setup (Phase 15) ==="
echo ""

if ! command -v wrangler &>/dev/null; then
  echo "Install wrangler: npm install -g wrangler"
  exit 1
fi

echo "Step 1: Login to Cloudflare"
echo "  npx wrangler login"
echo ""

echo "Step 2: Create D1 database (already created)"
echo "  Database: speak-coach"
echo "  ID: 07536dc7-b59c-4320-bc2f-faabca36caae"
echo "  → Already set in workers/api/wrangler.jsonc"
echo ""

echo "Step 3: Create R2 bucket"
echo "  npx wrangler r2 bucket create speak-coach-voice"
echo ""

echo "Step 4: Set secrets (workers/api)"
echo "  cd workers/api"
echo "  npx wrangler secret put JWT_SECRET"
echo "  npx wrangler secret put RESEND_API_KEY         # optional, OTP email in production"
echo "  npx wrangler secret put EXPO_ACCESS_TOKEN    # optional, for mobile server push"
echo "  npx wrangler secret put VAPID_PUBLIC_KEY       # optional, for web push"
echo "  npx wrangler secret put VAPID_PRIVATE_KEY"
echo "  # Optional — expose OTP in JSON for smoke:full / local only (not for real prod users)"
echo "  npx wrangler secret put AUTH_DEV_EXPOSE_OTP    # value: true"
echo ""

echo "Step 5: Generate VAPID keys (web push)"
echo "  npx web-push generate-vapid-keys"
echo ""

echo "Step 6: Deploy"
echo "  export NEXT_PUBLIC_API_URL=https://speak-coach-api.YOUR.workers.dev"
echo "  npm run deploy:all"
echo ""

echo "Step 7: Mobile EAS build"
echo "  cd apps/mobile && eas init   # sets real projectId in app.json"
echo "  EXPO_PUBLIC_API_URL=https://... eas build --profile preview"
echo ""

if grep -q "local-speak-coach-db" workers/api/wrangler.jsonc 2>/dev/null; then
  echo "⚠️  wrangler.jsonc still has placeholder database_id — update before remote deploy"
else
  echo "✅ wrangler.jsonc database_id configured (speak-coach)"
fi

if grep -q '"account_id"' workers/api/wrangler.jsonc 2>/dev/null; then
  echo "✅ wrangler.jsonc account_id configured"
else
  echo "⚠️  wrangler.jsonc missing account_id"
fi

echo ""
echo "Setup guide complete. Run deploy:all when ready."
