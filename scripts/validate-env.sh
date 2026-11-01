#!/bin/bash
# Validate environment before deploy
set -e

echo "=== Speak Coach Env Validation ==="
errors=0

check_var() {
  local name="$1"
  local required="${2:-false}"
  local val="${!name:-}"
  if [ -z "$val" ]; then
    if [ "$required" = "true" ]; then
      echo "❌ $name is required but not set"
      errors=$((errors + 1))
    else
      echo "⚠️  $name not set (optional)"
    fi
  else
    echo "✅ $name is set"
  fi
}

# Empty string is valid: client uses same-origin /api (Pages Function proxy).
if [ -z "${NEXT_PUBLIC_API_URL+x}" ]; then
  echo "⚠️  NEXT_PUBLIC_API_URL unset — deploy will use same-origin /api (recommended)"
elif [ -z "$NEXT_PUBLIC_API_URL" ]; then
  echo "✅ NEXT_PUBLIC_API_URL empty (same-origin /api)"
else
  echo "✅ NEXT_PUBLIC_API_URL is set"
fi

echo "ℹ️  Production API auth: cd workers/api && npx wrangler secret put JWT_SECRET"

if [ ! -f "workers/api/wrangler.jsonc" ]; then
  echo "⚠️  Missing workers/api/wrangler.jsonc — copy from wrangler.jsonc.example (file is gitignored)"
elif grep -qE 'YOUR_D1_DATABASE_ID|local-speak-coach-db' workers/api/wrangler.jsonc; then
  echo "⚠️  wrangler.jsonc still has placeholder database_id — update before remote deploy"
else
  echo "✅ wrangler.jsonc database_id configured"
fi

if [ -f "apps/web/public/icon-192.png" ] && [ -f "apps/web/public/icon-512.png" ]; then
  echo "✅ PWA icons present"
else
  echo "⚠️  PWA icons missing"
fi

echo ""
if [ "$errors" -gt 0 ]; then
  echo "Validation failed with $errors error(s)"
  exit 1
fi
echo "Validation passed"
