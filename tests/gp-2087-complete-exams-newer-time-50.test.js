// gp-2087-complete-exams-time-50min-newer-exams.test.js
// Newer exams RP8-11 must have time_minutes=50.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER = ['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass = 0, fail = 0; const failures = [];
for (const examId of NEWER) {
  const data = JSON.parse(fs.readFileSync(require('path').join(DATA_DIR, examId+'.json'), 'utf8'));
  if (data.time_minutes === 50) pass++;
  else { fail++; failures.push(examId + ' time_minutes=' + data.time_minutes); }
}
console.log('gp-2087-newer-time-50: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- newer exams (RP8-11) have time_minutes=50');
