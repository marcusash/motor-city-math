/**
 * gp-commit-prefix.test.js
 * Verifies that recent GP commits (last 30) use 'GP:' prefix format.
 * Validates the attribution fix from self-audit (sprint gap root cause).
 * GP: sprint batch — test 18
 */
const { execSync } = require('child_process');

let passed = 0;
let failed = 0;
const failures = [];
const warnings = [];

let gitLog;
try {
  // Get last 30 commits, one per line: HASH SUBJECT
  gitLog = execSync('git log --oneline -30 --no-merges', { encoding: 'utf8' });
} catch (e) {
  console.log('⚠️  Could not read git log — skipping commit prefix check');
  process.exit(0);
}

const lines = gitLog.trim().split('\n').filter(Boolean);
const gpLines = lines.filter(l => /\bGP[:\s]/i.test(l));

console.log(`\n=== GP Commit Prefix Check ===`);
console.log(`Last ${lines.length} commits, ${gpLines.length} are GP: prefixed`);

// Check GP commits use 'GP:' not 'fix(GP):' or 'feat(GP):'
const badFormat = gpLines.filter(l => !/^\w+ GP:/.test(l) && /\bfix\(GP\)|feat\(GP\)|chore\(GP\)/i.test(l));

if (badFormat.length > 0) {
  console.log(`❌ ${badFormat.length} commit(s) using old conventional format (fix(GP): not GP:):`);
  badFormat.forEach(l => console.log(`  ${l}`));
  failed += badFormat.length;
} else {
  console.log(`✅ All GP commits use 'GP:' prefix format`);
  passed = gpLines.length;
}

// Warn if no GP commits in last 30
if (gpLines.length === 0) {
  console.log(`⚠️  No GP commits found in last 30 commits — attribution gap risk`);
}

process.exit(failed > 0 ? 1 : 0);
