// gp-2061-complete-exams-per-exam-input-snapshot.test.js
// Per-exam input count snapshot locked.
// Snapshot: RP1=24, RP2=24, RP3=25, RP4=28, RP5=28, RP6=30, RP7=41, RP8=38, RP9=39, RP10=40, RP11=42, RP12=29

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1': 24, 'retake-practice-2': 24, 'retake-practice-3': 25,
  'retake-practice-4': 28, 'retake-practice-5': 28, 'retake-practice-6': 30,
  'retake-practice-7': 41, 'retake-practice-8': 38, 'retake-practice-9': 39,
  'retake-practice-10': 40, 'retake-practice-11': 42, 'retake-practice-12': 29
};
let pass = 0, fail = 0; const failures = [];
for (const [examId, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, examId + '.json'), 'utf8'));
  let count = 0; for (const q of data.questions) count += (q.inputs || []).length;
  if (count === expected) pass++;
  else { fail++; failures.push(examId + ' inputs=' + count + ' expected=' + expected); }
}
console.log('gp-2061-per-exam-inputs: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 per-exam input counts match snapshot');
