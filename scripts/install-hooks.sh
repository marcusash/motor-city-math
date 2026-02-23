#!/bin/bash
# Install GP pre-commit hook
# Run this script on fresh clone: bash scripts/install-hooks.sh
cp scripts/gp-pre-commit-hook.js .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "GP pre-commit hook installed (8 checks active)"
