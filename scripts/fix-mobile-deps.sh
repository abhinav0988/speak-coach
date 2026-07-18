#!/bin/bash
# Install mobile app deps in isolation (not hoisted with web/expo 56)
set -e
cd "$(dirname "$0")/../apps/mobile"

echo "=== Installing mobile dependencies (isolated from web workspace) ==="
npm install

echo ""
echo "✅ Done. Start mobile:"
echo "  cd apps/mobile && npm run dev"
