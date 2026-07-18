#!/bin/bash
# Lightweight health smoke for Speak Coach API
set -e

API_URL="${API_URL:-http://localhost:8787}"

pass=0
fail=0

check() {
  local name="$1"
  local url="$2"
  status=$(curl -s -o /tmp/smoke-body.json -w "%{http_code}" "$url")
  if [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
    echo "✅ $name ($status)"
    pass=$((pass + 1))
  else
    echo "❌ $name ($status)"
    fail=$((fail + 1))
  fi
}

echo "=== Speak Coach Smoke (public) ==="
echo "API: $API_URL"
echo ""

check "Health" "$API_URL/api/health"

# Protected routes must reject unauthenticated callers
status=$(curl -s -o /tmp/smoke-body.json -w "%{http_code}" "$API_URL/api/dashboard")
if [ "$status" = "401" ]; then
  echo "✅ Dashboard unauthorized without session (401)"
  pass=$((pass + 1))
else
  echo "❌ Dashboard expected 401, got $status"
  fail=$((fail + 1))
fi

echo ""
echo "=== Results: $pass passed, $fail failed ==="
if [ "$fail" -gt 0 ]; then
  exit 1
fi
