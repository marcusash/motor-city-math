/**
 * GF Kai Morning Smoke Check (gf-queue-kai-morning-smoke)
 *
 * Fast daily check: run before Kai starts a study session.
 * Checks that all critical user-facing functionality is intact.
 * Outputs a human-readable status summary Marcus can read in 30 seconds.
 *
 * Usage:
 *   node tests/kai-morning-smoke.js
 *
 * Target: < 30 seconds total runtime, 0 browser dependencies
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const t0 = Date.now();

function run(cmd, timeout = 20000) {
  try {
    const out = execSync(cmd, { cwd: ROOT, timeout }).toString();
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: (e.stdout || '').toString(), err: (e.stderr || '').toString() };
  }
}

function runTest(suite) {
  const p = path.join(ROOT, 'tests', 'f-validation', suite);
  return run(`node "${p}"`);
}

const results = [];
function check(label, ok, detail = '') {
  results.push({ label, ok, detail });
  const mark = ok ? '✓' : '✗';
  const line = `  ${mark} ${label}${detail ? '  [' + detail + ']' : ''}`;
  console.log(line);
}

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
console.log(`\n🏀 Kai Morning Smoke Check — ${today}`);
console.log('─'.repeat(52));

// ============================================================
// 1. Critical file presence (would Kai's browser see anything?)
// ============================================================
console.log('\n[Pages]');
const pages = ['index.html', 'exam.html', 'final_exam_251123.html', 'nonlinear_exam_mvp.html'];
pages.forEach(p => {
  const exists = fs.existsSync(path.join(ROOT, p));
  check(p, exists, exists ? '' : 'MISSING');
});

// ============================================================
// 2. Script syntax (would any page fail to load?)
// ============================================================
console.log('\n[Script Syntax]');
const syntaxR = runTest('inline-script-syntax-check.test.js');
check('All inline <script> blocks parse', syntaxR.ok, syntaxR.ok ? '' : 'PARSE ERROR — page would be blank');

// ============================================================
// 3. Data integrity (would Kai's questions load?)
// ============================================================
console.log('\n[Question Data]');
const dataDir = path.join(ROOT, 'data');
const rpFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'));
let dataOk = true;
let dataErrors = [];
rpFiles.forEach(f => {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
    if (!d.questions || !Array.isArray(d.questions) || d.questions.length < 1) {
      dataErrors.push(f + ': empty');
      dataOk = false;
    }
  } catch (e) {
    dataErrors.push(f + ': invalid JSON');
    dataOk = false;
  }
});
check(`Practice sets (${rpFiles.length} RP files)`, dataOk, dataErrors.join(', '));

// ============================================================
// 4. Grading integrity
// ============================================================
console.log('\n[Grading]');
const gradingR = runTest('grading-regression.test.js');
check('Grading regression suite', gradingR.ok, gradingR.ok ? '' : 'SCORING BUG DETECTED');

const mvpR = runTest('mvp-grading.test.js');
check('MVP grading checks', mvpR.ok, mvpR.ok ? '' : 'MVP GRADING BROKEN');

// ============================================================
// 5. Score persistence (would Kai lose her progress?)
// ============================================================
console.log('\n[Score Persistence]');
const storageR = runTest('mvp-score-storage.test.js');
check('Score storage contract', storageR.ok, storageR.ok ? '' : 'SCORE STORAGE BROKEN');

const localR = runTest('localstorage-schema-guard.test.js');
check('localStorage schema guard', localR.ok, localR.ok ? '' : 'STORAGE SCHEMA MISMATCH');

// ============================================================
// 6. Math correctness spot-check
// ============================================================
console.log('\n[Math]');
const mathR = run('node tests/lint-math-json.js');
const mathClean = mathR.ok && !mathR.out.includes('[E-');
check('Math JSON lint (0 errors)', mathClean, mathClean ? '' : 'MATH ERRORS — check tests/lint-math-json.js');

const crossR = run('node tests/cross-exam-verify.js');
check('Cross-exam answer dedup', crossR.ok, crossR.ok ? '' : 'DEDUP FAILURES');

// ============================================================
// 7. UI contracts spot-check
// ============================================================
console.log('\n[UI Contracts]');
const timerR = runTest('timer-contract.test.js');
check('Timer contract', timerR.ok, timerR.ok ? '' : 'TIMER BROKEN');

const hintR = runTest('hint-display-contract.test.js');
check('Hint display contract', hintR.ok, hintR.ok ? '' : 'HINTS BROKEN');

const scoreR = runTest('standard-score-rollup.test.js');
check('Score rollup', scoreR.ok, scoreR.ok ? '' : 'SCORE DISPLAY BROKEN');

// ============================================================
// Summary
// ============================================================
const elapsed = Date.now() - t0;
const totalChecks = results.length;
const passCount = results.filter(r => r.ok).length;
const failCount = results.filter(r => !r.ok).length;
const failures = results.filter(r => !r.ok);

console.log('\n' + '─'.repeat(52));
console.log(`${passCount}/${totalChecks} checks passed  (${elapsed}ms)`);

if (failCount === 0) {
  console.log('\n✅ ALL GREEN — Kai is good to study!\n');
} else {
  console.log(`\n🔴 ${failCount} issue(s) found:`);
  failures.forEach(f => console.log(`   • ${f.label}: ${f.detail || 'failed'}`));
  console.log('\nDo not start a study session until issues are resolved.\n');
  process.exit(1);
}
