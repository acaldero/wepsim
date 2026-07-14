#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "==> Checking external bundles..."
if [ ! -f "$ROOT_DIR/ws_dist/min.external.js" ]; then
    echo "  External bundles not found — run 'npm run build:legacy' first to generate them."
    exit 1
fi

echo "==> Starting Vite dev server..."
cd "$ROOT_DIR"
npx vite --host 0.0.0.0 --port 8000
