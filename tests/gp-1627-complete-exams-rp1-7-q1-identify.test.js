// gp-1627-complete-exams-rp1-7-q1-identify.test.js
// RP1-7 and RP12 Q1 must be type=identify (older exam schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER_SCHEMA = ['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
  'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12'];
let pass = 0, fail = 0; const failures = [];
for (const examId of OLDER_SCHEMA) {
  const fp = require('path').join(DATA_DIR, examId + '.json');
  if (!fs.existsSync(fp)) continue;
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (data.questions.length !== 15) continue;
  const q1 = data.questions[0];
  if (q1.type === 'identify') pass++;
  else { fail++; failures.push(examId + ': Q1 type=' + q1.type); }
}
console.log('gp-1627-older-schema-q1-identify: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-7 and RP12 Q1 type=identify confirmed');
