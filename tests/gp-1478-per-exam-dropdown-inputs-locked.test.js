// gp-1478-per-exam-dropdown-inputs-locked.test.js
// Dropdown input counts per exam: RP1-7 have 3, RP8-11 have 0.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1': 3, 'retake-practice-2': 3, 'retake-practice-3': 3,
  'retake-practice-4': 3, 'retake-practice-5': 3, 'retake-practice-6': 3,
  'retake-practice-7': 3, 'retake-practice-8': 0, 'retake-practice-9': 0,
  'retake-practice-10': 0, 'retake-practice-11': 0
};
let pass = 0, fail = 0; const failures = [];
for (const [examId, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, examId + '.json'), 'utf8'));
  const actual = data.questions.reduce((s, q) => s + (q.inputs || []).filter(i => i.type === 'dropdown').length, 0);
  if (actual === expected) pass++;
  else { fail++; failures.push(examId + ': expected=' + expected + ' got=' + actual); }
}
console.log('gp-1478-per-exam-dropdown-inputs: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- dropdown: RP1-7=3, RP8-11=0 -- all locked');
