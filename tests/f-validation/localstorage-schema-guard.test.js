/**
 * localstorage-schema-guard.test.js
 * Guards mcm_scores storage/export schema compatibility between exam.html and index.html.
 *
 * Run: node tests/f-validation/localstorage-schema-guard.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf-8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const scoreExport = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'kai-scores-2026-02-22.json'), 'utf-8'));

let total = 0, pass = 0, fail = 0;
function test(name, ok, detail = '') {
  total++;
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function isNum(n) { return typeof n === 'number' && Number.isFinite(n); }

console.log('\n🏀 localstorage-schema-guard.test.js\n');

console.log('── Producer/consumer contract checks ──');
test('exam writes mcm_scores to localStorage', examHtml.includes("localStorage.setItem('mcm_scores'"));
test('exam stores attempts[]', examHtml.includes('attempts') && examHtml.includes('scores[storageKey].attempts.push(attempt)'));
test('exam stores best score snapshot', examHtml.includes('scores[storageKey].best'));
test('index reads mcm_scores from localStorage', indexHtml.includes("localStorage.getItem('mcm_scores')"));
test('index supports attempts[] access pattern', indexHtml.includes('s.attempts') && indexHtml.includes('s.attempts.length'));
test('index supports legacy pct-only fallback', indexHtml.includes('(s.pct ? [s] : [])'));

console.log('\n── Export schema checks (data/kai-scores-2026-02-22.json) ──');
test('top-level has mcm_scores object', !!scoreExport.mcm_scores && typeof scoreExport.mcm_scores === 'object');

const entries = Object.entries(scoreExport.mcm_scores || {});
test('has at least one score entry', entries.length > 0, `found ${entries.length}`);

for (const [key, obj] of entries) {
  test(`${key}: has attempts[]`, Array.isArray(obj.attempts), 'missing attempts array');
  test(`${key}: has best object`, !!obj.best && typeof obj.best === 'object', 'missing best object');

  if (Array.isArray(obj.attempts)) {
    obj.attempts.forEach((a, i) => {
      const prefix = `${key}: attempts[${i}]`;
      test(`${prefix} score is numeric`, isNum(a.score));
      test(`${prefix} total is numeric`, isNum(a.total));
      test(`${prefix} pct is numeric`, isNum(a.pct));
      test(`${prefix} grade is numeric`, isNum(a.grade));
      test(`${prefix} timestamp exists`, typeof a.timestamp === 'string' && a.timestamp.length > 0);
      if (a.sections) {
        test(`${prefix} sections is object`, typeof a.sections === 'object');
      }
      if (a.questions) {
        test(`${prefix} questions is object`, typeof a.questions === 'object');
      }
    });
  }

  if (obj.best) {
    test(`${key}: best.score numeric`, isNum(obj.best.score));
    test(`${key}: best.pct numeric`, isNum(obj.best.pct));
    test(`${key}: best.grade numeric`, isNum(obj.best.grade));
  }
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);

if (fail > 0) process.exit(1);
