#!/bin/sh
# Motor City Math — Pre-commit Safety Check
# PM-3: Prevents regressions caught in postmortem
#
# Flags:
#   (a) polyfill.io references (compromised CDN — B-F4)
#   (b) CDN URLs when local bundles exist (KaTeX, Chart.js)
#   (c) File size decrease >20% on key protected files
#
# Install: copy to .git/hooks/pre-commit (or run setup below)
# Run manually: node tests/f-validation/pre-commit-check.js

echo "🏀 Motor City Math — Pre-commit safety check..."

# Run the Node.js checker (works on Windows + Mac + Linux)
node "$(git rev-parse --show-toplevel)/tests/f-validation/pre-commit-check.js"
exit $?
