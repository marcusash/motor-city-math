// gp-2086-complete-exams-time-60min-older-exams.test.js
// Older exams RP1-7 and RP12 must have time_minutes=60.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER = ['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
  'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12'];
let pass = 0, fail = 0; const failures = [];
for (const examId of OLDER) {
  const data = JSON.parse(fs.readFileSync(require('path').join(DATA_DIR, examId+'.json'), 'utf8'));
  if (data.time_minutes === 60) pass++;
  else { fail++; failures.push(examId + ' time_minutes=' + data.time_minutes); }
}
console.log('gp-2086-older-time-60: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- older exams (RP1-7, RP12) have time_minutes=60');
