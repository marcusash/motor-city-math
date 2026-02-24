// gp-1476-per-exam-total-inputs-locked.test.js
// Total input counts per exam are regression-locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1': 24, 'retake-practice-2': 24, 'retake-practice-3': 25,
  'retake-practice-4': 28, 'retake-practice-5': 28, 'retake-practice-6': 30,
  'retake-practice-7': 41, 'retake-practice-8': 38, 'retake-practice-9': 39,
  'retake-practice-10': 40, 'retake-practice-11': 42
};
let pass = 0, fail = 0; const failures = [];
for (const [examId, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, examId + '.json'), 'utf8'));
  const actual = data.questions.reduce((s, q) => s + (q.inputs || []).length, 0);
  if (actual === expected) pass++;
  else { fail++; failures.push(examId + ': expected=' + expected + ' got=' + actual); }
}
console.log('gp-1476-per-exam-total-inputs: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 11 per-exam input totals locked');
