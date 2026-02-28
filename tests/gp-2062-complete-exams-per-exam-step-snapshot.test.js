// gp-2062-complete-exams-per-exam-step-snapshot.test.js
// Per-exam solution step count snapshot locked.
// Snapshot: RP1=69, RP2=72, RP3=71, RP4=71, RP5=89, RP6=62, RP7=70, RP8=61, RP9=57, RP10=61, RP11=65, RP12=74

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1': 69, 'retake-practice-2': 72, 'retake-practice-3': 71,
  'retake-practice-4': 71, 'retake-practice-5': 89, 'retake-practice-6': 62,
  'retake-practice-7': 70, 'retake-practice-8': 61, 'retake-practice-9': 57,
  'retake-practice-10': 61, 'retake-practice-11': 65, 'retake-practice-12': 74
};
let pass = 0, fail = 0; const failures = [];
for (const [examId, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, examId + '.json'), 'utf8'));
  let count = 0; for (const q of data.questions) count += (q.solution_steps || []).length;
  if (count === expected) pass++;
  else { fail++; failures.push(examId + ' steps=' + count + ' expected=' + expected); }
}
console.log('gp-2062-per-exam-steps: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 per-exam solution step counts match snapshot');
