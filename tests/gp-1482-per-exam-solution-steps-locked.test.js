// gp-1482-per-exam-solution-steps-locked.test.js
// Per-exam solution step counts are regression-locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1': 69, 'retake-practice-2': 72, 'retake-practice-3': 71,
  'retake-practice-4': 71, 'retake-practice-5': 89, 'retake-practice-6': 62,
  'retake-practice-7': 70, 'retake-practice-8': 61, 'retake-practice-9': 57,
  'retake-practice-10': 61, 'retake-practice-11': 65
};
let pass = 0, fail = 0; const failures = [];
for (const [examId, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, examId + '.json'), 'utf8'));
  const actual = data.questions.reduce((s, q) => s + (q.solution_steps || []).length, 0);
  if (actual === expected) pass++;
  else { fail++; failures.push(examId + ': expected=' + expected + ' got=' + actual); }
}
console.log('gp-1482-per-exam-steps: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 11 per-exam solution step counts locked');
