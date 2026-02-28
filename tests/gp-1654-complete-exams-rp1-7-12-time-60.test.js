// gp-1654-complete-exams-rp1-7-12-time-60.test.js
// RP1-7 and RP12 must have time_minutes=60 (older schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER = ['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
  'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12'];
let pass = 0, fail = 0; const failures = [];
for (const examId of OLDER) {
  const fp = require('path').join(DATA_DIR, examId + '.json');
  if (!fs.existsSync(fp)) continue;
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.time_minutes === 60) pass++;
  else { fail++; failures.push(examId + ': time_minutes=' + data.time_minutes); }
}
console.log('gp-1654-older-schema-time-60: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-7 and RP12 all have time_minutes=60');
