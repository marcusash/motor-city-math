// gp-2084-complete-exams-older-exams-rp1-7-q1-identify.test.js
// Older exams RP1-7 and RP12: Q1 is type 'identify'.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER = ['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
  'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12'];
let pass = 0, fail = 0; const failures = [];
for (const examId of OLDER) {
  const data = JSON.parse(fs.readFileSync(require('path').join(DATA_DIR, examId+'.json'), 'utf8'));
  const q1 = data.questions.find(q => q.number === 1);
  if (q1 && q1.type === 'identify') pass++;
  else { fail++; failures.push(examId + ' Q1.type=' + (q1 ? q1.type : 'MISSING')); }
}
console.log('gp-2084-older-exams-q1-identify: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- older exams (RP1-7, RP12) have Q1 type=identify');
