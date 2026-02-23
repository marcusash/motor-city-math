/**
 * precommit-guard-audit.test.js
 * GF gf-skill-20: Audits the pre-commit-check.js guard itself.
 * Verifies that all required check categories exist, that the script
 * can be invoked, and documents any known gaps.
 *
 * This is a meta-test: it tests the test infrastructure.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const PRE_COMMIT_PATH = path.resolve(__dirname, 'pre-commit-check.js');

let passed = 0;
let failed = 0;
const gaps = [];

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

function gap(msg) {
  gaps.push(msg);
}

console.log('\nPre-commit Guard Audit\n');

// === 1. Pre-commit file exists and is runnable ===
console.log('  1. File existence:');

if (fs.existsSync(PRE_COMMIT_PATH)) {
  pass('pre-commit-check.js exists');
} else {
  fail('pre-commit-check.js missing');
  process.exit(1);
}

const script = fs.readFileSync(PRE_COMMIT_PATH, 'utf8');
pass(`pre-commit-check.js: ${script.split('\n').length} lines`);

// === 2. Required check categories ===
console.log('\n  2. Required check categories:');

const categories = [
  { name: 'polyfill.io ban', pattern: /polyfill.*io|bannedCdn/i },
  { name: 'CDN URL detection', pattern: /cdn\.jsdelivr|cdnChecks/i },
  { name: 'HTML structure duplicate tags', pattern: /duplicate.*tag|structChecks/i },
  { name: 'file size protection', pattern: /size.*decrease|committedSize|PROTECTED_FILES/i },
  { name: 'hardcoded hex ban', pattern: /BANNED_HEX|hardcoded hex/i },
  { name: '--all flag support', pattern: /process\.argv\.includes.*--all|checkAll/i },
  { name: 'staged-only mode (git diff)', pattern: /git diff.*cached/i },
  { name: 'exit code 1 on block', pattern: /process\.exit\(1\)/i },
  { name: 'exit code 0 on warnings', pattern: /process\.exit\(0\)/i },
];

for (const cat of categories) {
  if (cat.pattern.test(script)) {
    pass(`category present: ${cat.name}`);
  } else {
    fail(`category MISSING: ${cat.name}`);
  }
}

// === 3. Check that --all mode runs without crashing ===
console.log('\n  3. Smoke test (--all mode):');

let output = '';
let exitCode = 0;
try {
  output = execSync(`node "${PRE_COMMIT_PATH}" --all`, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
} catch (e) {
  output = e.stdout || '';
  exitCode = e.status || 1;
}

if (output.includes('Files checked:')) {
  pass('--all mode runs and reports file count');
} else {
  fail('--all mode did not produce expected output');
}

// Parse blocked count from output
const blockedMatch = output.match(/Blocked:\s*(\d+)/);
const blockedCount = blockedMatch ? parseInt(blockedMatch[1]) : -1;

if (blockedCount === 0) {
  pass(`--all mode: 0 blocked (clean baseline)`);
} else if (blockedCount > 0) {
  fail(`--all mode: ${blockedCount} blocked issue(s) found — must resolve`);
} else {
  fail('--all mode: could not parse blocked count');
}

// Parse warnings
const warnMatch = output.match(/Warnings:\s*(\d+)/);
const warnCount = warnMatch ? parseInt(warnMatch[1]) : -1;
if (warnCount >= 0) {
  pass(`--all mode: ${warnCount} warning(s) (Chart.js CDN warnings expected)`);
}

// === 4. Known gaps documentation ===
console.log('\n  4. Known gaps in pre-commit-check.js:');

// Gap: no inline script syntax check (see postmortem)
if (!script.includes('node --check') && !script.includes('syntax')) {
  gap('No inline script syntax gate (node --check) — see postmortem-20260222. Covered by inline-script-syntax-check.test.js but not in pre-commit hook.');
}

// Gap: no JSON validity check on data/*.json files
if (!script.includes('.json')) {
  gap('No JSON validity check on data/*.json files — large data file corruption would be undetected until runtime.');
}

// Gap: no check for inline-script-syntax on commit
if (!script.includes('inline-script-syntax')) {
  gap('Pre-commit does not call inline-script-syntax-check.test.js — parser failures could reach production.');
}

if (gaps.length === 0) {
  pass('no known gaps');
} else {
  console.log(`\n  \u26A0  ${gaps.length} known gap(s) — not blocking, but should be addressed:`);
  gaps.forEach((g, i) => console.log(`     ${i + 1}. ${g}`));
  pass(`${gaps.length} gap(s) documented (non-blocking)`);
}

// === 5. Pre-commit hook integration ===
console.log('\n  5. Git hook integration:');

const hookPath = path.join(ROOT, '.git', 'hooks', 'pre-commit');
const hookShPath = path.join(ROOT, 'tests', 'f-validation', 'pre-commit-hook.sh');

if (fs.existsSync(hookPath)) {
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  if (hookContent.includes('pre-commit-check.js')) {
    pass('.git/hooks/pre-commit calls pre-commit-check.js');
  } else {
    gap('.git/hooks/pre-commit exists but does not call pre-commit-check.js');
    pass('.git/hooks/pre-commit exists (content check: see gap above)');
  }
} else {
  gap('.git/hooks/pre-commit not installed — pre-commit check runs manually only');
  pass('.git/hooks/pre-commit: not installed (manual run available via node tests/f-validation/pre-commit-check.js)');
}

if (fs.existsSync(hookShPath)) {
  pass('pre-commit-hook.sh template exists for installation');
} else {
  gap('pre-commit-hook.sh template missing — document installation instructions');
  pass('pre-commit-hook.sh: template not found (gap documented)');
}

console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}
