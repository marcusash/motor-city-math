/**
 * takeover-regression-static.test.js
 * Static regression checks for FA/FD/FR takeover changes.
 *
 * Run: node tests/f-validation/takeover-regression-static.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf-8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

let pass = 0, fail = 0, total = 0;
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

console.log('\n🏀 takeover-regression-static.test.js\n');

// exam.html takeover checks
test('exam: blank-field grading guard exists', examHtml.includes('Block grading if any required field is blank'));
test('exam: score lock gate exists', examHtml.includes('if (examGraded) return;'));
test('exam: retake-only run-it-back logic exists', examHtml.includes('isRetake') && examHtml.includes('Run It Back'));
test('exam: sqrt parser support exists', examHtml.includes('sqrt(') && examHtml.includes('safe evaluator'));
test('exam: per-input feedback classes exist', examHtml.includes('answer-feedback') && examHtml.includes('feedback_wrong_intercepts'));
test('exam: local KaTeX assets used', examHtml.includes('shared/katex/katex.min.css') && examHtml.includes('shared/katex/auto-render.min.js'));

// index.html takeover checks
test('index: Dad Mode banner hook exists', indexHtml.includes('Dad Mode banner') || indexHtml.includes('dad-banner'));
test('index: restore mode hook exists', indexHtml.includes('?restore=1') && indexHtml.includes('localStorage.setItem(\'mcm_scores\''));
test('index: SVG score chart exists', indexHtml.includes('<svg role="img" aria-label="Score progress chart'));
test('index: practice 8/9 present', indexHtml.includes('retake-practice-8') && indexHtml.includes('retake-practice-9'));
test('index: standards include practice exams fix present', indexHtml.includes('include practice exams') || indexHtml.includes('practice'));

// data presence checks
const requiredData = [
  'retake-practice-8.json',
  'retake-practice-9.json',
  'kai-scores-2026-02-22.json',
];
for (const file of requiredData) {
  test(`data: ${file} exists`, fs.existsSync(path.join(ROOT, 'data', file)));
}

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);

if (fail > 0) process.exit(1);
