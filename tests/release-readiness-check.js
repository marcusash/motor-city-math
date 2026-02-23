/**
 * GF Release Readiness Check (gf-skill-24)
 *
 * Automated pre-publish gate. Run before every push to motor-city-math.
 * Fails fast if any hard gate fails.
 *
 * Usage:
 *   node tests/release-readiness-check.js
 *   node tests/release-readiness-check.js --soft  # warn on soft failures, don't exit 1
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOFT_MODE = process.argv.includes('--soft');
const ROOT = path.join(__dirname, '..');
const TESTS_DIR = path.join(__dirname, 'f-validation');

let totalGates = 0;
let passedGates = 0;
let failedHard = 0;
let failedSoft = 0;

function gate(label, { hard = true } = {}) {
  return (ok, detail = '') => {
    totalGates++;
    const tag = hard ? '[HARD]' : '[SOFT]';
    if (ok) {
      passedGates++;
      console.log(`  ✓ ${label}`);
    } else {
      const prefix = hard ? '✗' : '⚠';
      console.log(`  ${prefix} ${label}${detail ? ': ' + detail : ''}`);
      if (hard) failedHard++;
      else failedSoft++;
    }
    return ok;
  };
}

function run(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { cwd: ROOT, timeout: 60000, ...opts }).toString();
    return { ok: true, out, exitCode: 0 };
  } catch (e) {
    return { ok: false, out: (e.stdout || '').toString(), err: (e.stderr || '').toString(), exitCode: e.status || 1 };
  }
}

function runTest(suite) {
  const p = path.join(TESTS_DIR, suite);
  return run(`node "${p}"`);
}

// ============================================================
// GATE 1: Inline script syntax (hard) — postmortem-class gate
// ============================================================
console.log('\n[1] Inline Script Syntax');
{
  const g = gate('All inline <script> blocks parse cleanly');
  const r = runTest('inline-script-syntax-check.test.js');
  g(r.ok);
}

// ============================================================
// GATE 2: Math JSON lint (hard)
// ============================================================
console.log('\n[2] Math JSON Lint');
{
  const g = gate('retake-practice JSON: 0 E-5/E-6/E-7 errors');
  const r = run('node tests/lint-math-json.js 2>&1', { shell: true });
  const clean = r.ok && !r.out.includes('[E-');
  g(clean, clean ? '' : 'Run: node tests/lint-math-json.js for details');
}

// ============================================================
// GATE 3: Cross-exam dedup (hard)
// ============================================================
console.log('\n[3] Cross-Exam Answer Dedup');
{
  const g = gate('0 hard answer duplicates across all exams');
  const r = run('node tests/cross-exam-verify.js');
  g(r.ok);
}

// ============================================================
// GATE 4: Practice exam verification (hard)
// ============================================================
console.log('\n[4] Practice Exam Verification');
{
  const g = gate('verify-practice-exams: 0 hard failures');
  const r = run('node tests/verify-practice-exams.js');
  g(r.ok);
}

// ============================================================
// GATE 5: Regression replay (hard)
// ============================================================
console.log('\n[5] Regression Replay');
{
  const g = gate('No regressions vs baseline (tests/regression-baseline.json)');
  const baselineExists = fs.existsSync(path.join(__dirname, 'regression-baseline.json'));
  if (baselineExists) {
    const r = run('node tests/regression-replay.js --diff');
    g(r.ok);
  } else {
    g(false, 'No baseline — run: node tests/regression-replay.js --capture');
  }
}

// ============================================================
// GATE 6: Core static QA suite (hard) — known-fail allowlist
// ============================================================
console.log('\n[6] Core Static QA Suites');
const CORE_SUITES = [
  'localstorage-schema-guard.test.js',
  'inline-script-syntax-check.test.js',
  'keyboard-nav-pass.test.js',
  'scorecard-contract.test.js',
  'grading-audit.test.js',
  'grading-regression.test.js',
  'timer-contract.test.js',
  'standard-score-rollup.test.js',
  'seed-repro-extension.test.js',
  'export-import-qa.test.js',
];
CORE_SUITES.forEach(suite => {
  const g = gate(suite);
  const r = runTest(suite);
  g(r.ok);
});

// ============================================================
// GATE 7: Question type coverage (hard)
// ============================================================
console.log('\n[7] Question Type Coverage');
{
  const g = gate('All 6 question type floors met');
  const r = runTest('question-type-coverage.test.js');
  g(r.ok);
}

// ============================================================
// GATE 8: Design token enforcement (soft — GA may legitimately rename)
// ============================================================
console.log('\n[8] Design Token Enforcement (soft)');
{
  const g = gate('Color and font tokens consistent', { hard: false });
  const r1 = runTest('color-token-enforcement.test.js');
  const r2 = runTest('font-token-enforcement.test.js');
  g(r1.ok && r2.ok, (!r1.ok ? 'color-token fail' : '') + (!r2.ok ? ' font-token fail' : ''));
}

// ============================================================
// GATE 9: Flake registry current (soft)
// ============================================================
console.log('\n[9] Flake Registry');
{
  const g = gate('Flake registry schema valid', { hard: false });
  const r = runTest('flake-registry.test.js');
  g(r.ok);
}

// ============================================================
// GATE 10: localStorage schema (hard)
// ============================================================
console.log('\n[10] localStorage Contract');
{
  const g = gate('localStorage schema guard: all checks pass');
  const r = runTest('localstorage-schema-guard.test.js');
  g(r.ok);
}

// ============================================================
// SUMMARY
// ============================================================
console.log('\n' + '='.repeat(56));
console.log(`Release Readiness: ${passedGates}/${totalGates} gates passed`);
if (failedHard) console.log(`  HARD failures: ${failedHard} — BLOCKED`);
if (failedSoft) console.log(`  SOFT warnings: ${failedSoft} — review before shipping`);

if (failedHard === 0) {
  if (failedSoft === 0) {
    console.log('\n✓ RELEASE READY — all gates green.\n');
  } else {
    console.log('\n⚠ RELEASE READY WITH WARNINGS — review soft failures.\n');
  }
} else {
  console.log('\n✗ NOT RELEASE READY — fix hard failures before publishing.\n');
  if (!SOFT_MODE) process.exit(1);
}
