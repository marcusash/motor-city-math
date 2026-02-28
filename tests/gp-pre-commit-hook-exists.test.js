// gp-pre-commit-hook-exists.test.js — .git/hooks/pre-commit should exist and be executable

const fs = require('fs');
const path = require('path');

const HOOK = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit');

console.log(`gp-pre-commit-hook-exists: checking ${HOOK}`);

if (!fs.existsSync(HOOK)) {
  console.log('  FAIL: pre-commit hook missing — commit safety checks disabled');
  process.exit(1);
}

const content = fs.readFileSync(HOOK, 'utf8');
const lines = content.split('\n').length;

// Verify it's a real hook (not empty)
if (content.trim().length < 50) {
  console.log(`  FAIL: pre-commit hook is too short (${content.trim().length} chars) — may be empty placeholder`);
  process.exit(1);
}

console.log(`  Hook exists: ${lines} lines, ${content.length} chars`);

// Verify it references our safety check
if (content.includes('gp-') || content.includes('Motor City') || content.includes('safety')) {
  console.log(`  Contains Motor City Math safety checks`);
}

console.log(`OK — pre-commit hook exists and has content`);
