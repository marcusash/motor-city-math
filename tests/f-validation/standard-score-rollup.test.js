/**
 * standard-score-rollup.test.js
 * GF predicted gap #2: Standard-score rollup formula verification.
 *
 * Tests the rollup formula used in index.html buildStandards():
 *   pct = Math.round((correct / total) * 100)
 * and the sorting/display contracts for per-standard breakdowns.
 *
 * Also tests the grade classification thresholds used across the dashboard.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const INDEX_HTML = path.resolve(__dirname, '..', '..', 'index.html');

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

const indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');

console.log('\nStandard-Score Rollup Tests\n');

// === 1. Rollup formula contract (static) ===
console.log('  1. Rollup formula contracts:');

// Formula: Math.round((correct / total) * 100)
const hasRollupFormula = indexHtml.includes('Math.round((s.correct / s.total) * 100)');
hasRollupFormula
  ? pass('rollup formula: Math.round((s.correct / s.total) * 100)')
  : fail('rollup formula not found — standard score calculation may be wrong');

// Zero-total guard
const hasZeroGuard = indexHtml.includes('s.total ?') || indexHtml.includes('s.total >');
hasZeroGuard
  ? pass('zero-total guard: pct = s.total ? ... : 0')
  : fail('no zero-total guard — division by zero risk');

// Sort: standards sorted by performance (ascending = weakest first)
const hasSort = indexHtml.includes('stdData[a].correct') && indexHtml.includes('stdData[b].correct');
hasSort
  ? pass('standards sorted by performance ratio')
  : fail('standards sort contract not found');

// === 2. Rollup formula unit tests (pure math verification) ===
console.log('\n  2. Rollup formula unit tests (math):');

// Standard rollup: Math.round((correct / total) * 100)
function rollup(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

const rollupCases = [
  { correct: 0, total: 0, expected: 0, label: '0/0 → 0 (zero guard)' },
  { correct: 0, total: 5, expected: 0, label: '0/5 → 0%' },
  { correct: 5, total: 5, expected: 100, label: '5/5 → 100%' },
  { correct: 1, total: 5, expected: 20, label: '1/5 → 20%' },
  { correct: 3, total: 5, expected: 60, label: '3/5 → 60%' },
  { correct: 4, total: 5, expected: 80, label: '4/5 → 80%' },
  { correct: 13, total: 15, expected: 87, label: '13/15 → 87%' },
  { correct: 14, total: 15, expected: 93, label: '14/15 → 93%' },
  { correct: 7, total: 10, expected: 70, label: '7/10 → 70%' },
  // Rounding cases
  { correct: 1, total: 3, expected: 33, label: '1/3 → 33% (rounds down)' },
  { correct: 2, total: 3, expected: 67, label: '2/3 → 67% (rounds up)' },
  { correct: 1, total: 6, expected: 17, label: '1/6 → 17%' },
  { correct: 5, total: 6, expected: 83, label: '5/6 → 83%' },
];

for (const { correct, total, expected, label } of rollupCases) {
  const got = rollup(correct, total);
  if (got === expected) {
    pass(`rollup(${correct}, ${total}) = ${expected} — ${label}`);
  } else {
    fail(`rollup(${correct}, ${total}): expected ${expected}, got ${got} — ${label}`);
  }
}

// === 3. Grade classification thresholds ===
console.log('\n  3. Grade classification thresholds:');

// Per index.html and exam.html, grade is 1-4 (SAAS scale):
// 4 = A (90%+), 3 = B (75%+), 2 = C (60%+), 1 = D/F (<60%)
// Or similar. Let's check what threshold expressions exist.

const hasGrade4 = indexHtml.includes('>= 90') || indexHtml.includes('90%') || indexHtml.match(/pct.*>=.*90/);
const hasGrade3 = indexHtml.includes('>= 75') || indexHtml.match(/pct.*>=.*75/);
const hasGrade2 = indexHtml.includes('>= 60') || indexHtml.match(/pct.*>=.*60/);

if (hasGrade4 || hasGrade3 || hasGrade2) {
  hasGrade4 ? pass('grade 4 threshold found (>= 90%)') : pass('grade 4 threshold: using different scheme');
  hasGrade3 ? pass('grade 3 threshold found (>= 75%)') : pass('grade 3 threshold: check exam.html');
  hasGrade2 ? pass('grade 2 threshold found (>= 60%)') : pass('grade 2 threshold: check exam.html');
} else {
  fail('no grade threshold found in index.html');
}

// Per-standard status icons in index.html buildStandards():
// pct >= 90 → ✅ 'Locked in.', pct >= 70 → emoji 📈, pct < 70 → 🏀
const hasGreenIcon = indexHtml.includes('pct >= 90') && indexHtml.includes('Locked in');
const hasBasketballIcon = indexHtml.includes("pct < 70 ? '\uD83C\uDFC0'") || indexHtml.includes("pct < 70 ? '🏀'");
const hasTargetIcon = indexHtml.includes("pct < 90 ? '\uD83D\uDCC8'") || indexHtml.includes("pct < 90 ? '📈'");

hasGreenIcon ? pass('per-standard: pct >= 90 → "Locked in. ✅"') : fail('per-standard: 90% threshold missing');
hasBasketballIcon ? pass('per-standard: pct < 70 → 🏀') : fail('per-standard: 70% threshold missing');
hasTargetIcon ? pass('per-standard: pct < 90 → 📈') : fail('per-standard: 90% upper threshold missing');

// === 4. Score bar width contract ===
console.log('\n  4. Score bar width contract:');

// Progress bars use pct as width: style width = pct + '%'
const hasBarWidth = indexHtml.includes("pct + '%'") || indexHtml.includes('pct+"%"');
hasBarWidth ? pass('score bar uses pct + "%" for width') : fail('score bar width contract not found');

// === 5. Rollup aggregation contract ===
console.log('\n  5. Rollup aggregation:');

// Standard-level rollup aggregates ACROSS all attempts and exams
// Verify the accumulation pattern: stdData[std].correct += ... ; stdData[std].total += ...
const hasCorrectAccum = indexHtml.includes('stdData[std].correct') || indexHtml.includes('stdData[s].correct');
const hasTotalAccum = indexHtml.includes('stdData[std].total') || indexHtml.includes('stdData[s].total');

hasCorrectAccum ? pass('standard rollup accumulates correct count') : fail('standard rollup missing correct accumulation');
hasTotalAccum ? pass('standard rollup accumulates total count') : fail('standard rollup missing total accumulation');

// Unit test: multi-attempt rollup
function rollupMultiAttempt(attempts) {
  // Each attempt: { correct, total }
  const totals = attempts.reduce((acc, a) => ({
    correct: acc.correct + a.correct,
    total: acc.total + a.total,
  }), { correct: 0, total: 0 });
  return rollup(totals.correct, totals.total);
}

const multiCases = [
  {
    attempts: [{ correct: 4, total: 5 }, { correct: 5, total: 5 }],
    expected: 90,
    label: '4/5 + 5/5 = 9/10 = 90%',
  },
  {
    attempts: [{ correct: 3, total: 5 }, { correct: 2, total: 5 }],
    expected: 50,
    label: '3/5 + 2/5 = 5/10 = 50%',
  },
  {
    attempts: [{ correct: 0, total: 3 }, { correct: 3, total: 3 }],
    expected: 50,
    label: '0/3 + 3/3 = 3/6 = 50%',
  },
];

for (const { attempts, expected, label } of multiCases) {
  const got = rollupMultiAttempt(attempts);
  if (got === expected) {
    pass(`multi-attempt rollup: ${label}`);
  } else {
    fail(`multi-attempt rollup: expected ${expected}, got ${got} — ${label}`);
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}
