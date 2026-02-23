/**
 * scorecard-contract.test.js
 * Static contract checks for exam scorecard DOM/strings used by e2e and UX flows.
 *
 * Run: node tests/f-validation/scorecard-contract.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf-8');

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

console.log('\n🏀 scorecard-contract.test.js\n');

test('scorecard mount node exists', examHtml.includes('<div id="scorecard"'));
test('showScorecard function exists', examHtml.includes('function showScorecard(score, total, stdScores, results)'));
test('score headline uses "You got X out of Y" copy contract', examHtml.includes("html += '<h2>You got ' + score + ' out of ' + total + '</h2>';"));
test('scorecard percent node exists', examHtml.includes('class="score-big" id="scoreBigEl"'));
test('SAAS grade class contract exists', examHtml.includes("html += '<div class=\"saas-grade ' + gradeClass + '\">Grade ' + grade + '</div>';"));
test('game plan heading contract exists', examHtml.includes("Your Game Plan"));
test('standards grid and cards contract exists', examHtml.includes("standards-grid") && examHtml.includes("std-card"));
test('retake gate contract exists', examHtml.includes("var isRetake = examData && examData.exam_id && examData.exam_id.indexOf('retake') !== -1;"));
test('run-it-back CTA contract exists', examHtml.includes('Run It Back'));
test('dashboard CTA contract exists', examHtml.includes('Back to Dashboard'));
test('scorecard is rendered into #scorecard', examHtml.includes("document.getElementById('scorecard').innerHTML = html;"));
test('scorecard is shown after grading', examHtml.includes("document.getElementById('scorecard').style.display = '';"));

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);

if (fail > 0) process.exit(1);
