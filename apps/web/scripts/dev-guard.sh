#!/usr/bin/env bash
set -euo pipefail

WEB_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$WEB_ROOT"
PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"

# Explicit restart: npm run dev:clean
if [[ "${1:-}" == "--force" ]]; then
  shift
  exec bash ../../scripts/dev-web-clean.sh
fi

# Already healthy? Don't error — just tell the user.
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "${URL}/" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo ""
  echo "  Speak Coach is already running."
  echo "  → Open ${URL} in your browser"
  echo ""
  echo "  To restart fresh:  npm run dev:clean"
  echo ""
  exit 0
fi

# Broken server (500) or zombie process — auto-fix instead of leaving user stuck.
if [ "$HTTP_CODE" = "500" ] || [ "$HTTP_CODE" = "000" ] || pgrep -f "next dev" >/dev/null 2>&1; then
  if [ "$HTTP_CODE" = "500" ]; then
    echo ""
    echo "  Dev server returned Internal Server Error (corrupted cache)."
    echo "  Fixing automatically…"
    echo ""
  else
    echo ""
    echo "  Found a stale dev server. Cleaning up…"
    echo ""
  fi
  pkill -f "next dev" 2>/dev/null || true
  sleep 1
  rm -rf "$WEB_ROOT/.next"
fi

echo ""
echo "  Starting Speak Coach (web) at ${URL} …"
echo ""

exec npx next dev --turbopack "$@"
