#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/apps/web"
PORT="${PORT:-3000}"

echo ""
echo "  Restarting Speak Coach web dev server…"
echo ""

pkill -f "next dev" 2>/dev/null || true
sleep 1

rm -rf "$WEB/.next"

cd "$WEB"
echo "  → http://localhost:${PORT}"
echo "  (Turbopack · cache cleared)"
echo ""

exec npx next dev --turbopack
