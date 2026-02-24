// gp-1477-per-exam-text-inputs-locked.test.js
// Text input counts per exam are regression-locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1': 0, 'retake-practice-2': 0, 'retake-practice-3': 1,
  'retake-practice-4': 2, 'retake-practice-5': 2, 'retake-practice-6': 2,
  'retake-practice-7': 10, 'retake-practice-8': 11, 'retake-practice-9': 11,
  'retake-practice-10': 11, 'retake-practice-11': 11
};
let pass = 0, fail = 0; const failures = [];
for (const [examId, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, examId + '.json'), 'utf8'));
  const actual = data.questions.reduce((s, q) => s + (q.inputs || []).filter(i => i.type === 'text').length, 0);
  if (actual === expected) pass++;
  else { fail++; failures.push(examId + ': expected=' + expected + ' got=' + actual); }
}
console.log('gp-1477-per-exam-text-inputs: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 11 per-exam text input counts locked');
