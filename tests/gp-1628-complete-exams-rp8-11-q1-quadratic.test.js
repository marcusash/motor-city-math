// gp-1628-complete-exams-rp8-11-q1-quadratic.test.js
// RP8-11 Q1 must be type=quadratic (newer exam schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER_SCHEMA = ['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass = 0, fail = 0; const failures = [];
for (const examId of NEWER_SCHEMA) {
  const fp = require('path').join(DATA_DIR, examId + '.json');
  if (!fs.existsSync(fp)) continue;
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const q1 = data.questions[0];
  if (q1.type === 'quadratic') pass++;
  else { fail++; failures.push(examId + ': Q1 type=' + q1.type); }
}
console.log('gp-1628-newer-schema-q1-quadratic: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP8-11 Q1 type=quadratic confirmed');
