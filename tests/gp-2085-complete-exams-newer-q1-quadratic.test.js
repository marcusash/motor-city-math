// gp-2085-complete-exams-newer-exams-rp8-11-q1-quadratic.test.js
// Newer exams RP8-11: Q1 is type 'quadratic'.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER = ['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass = 0, fail = 0; const failures = [];
for (const examId of NEWER) {
  const data = JSON.parse(fs.readFileSync(require('path').join(DATA_DIR, examId+'.json'), 'utf8'));
  const q1 = data.questions.find(q => q.number === 1);
  if (q1 && q1.type === 'quadratic') pass++;
  else { fail++; failures.push(examId + ' Q1.type=' + (q1 ? q1.type : 'MISSING')); }
}
console.log('gp-2085-newer-exams-q1-quadratic: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- newer exams (RP8-11) have Q1 type=quadratic');
