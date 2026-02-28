// gp-1655-complete-exams-rp8-11-time-50.test.js
// RP8-11 must have time_minutes=50 (newer schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER = ['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass = 0, fail = 0; const failures = [];
for (const examId of NEWER) {
  const fp = require('path').join(DATA_DIR, examId + '.json');
  if (!fs.existsSync(fp)) continue;
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (data.time_minutes === 50) pass++;
  else { fail++; failures.push(examId + ': time_minutes=' + data.time_minutes); }
}
console.log('gp-1655-newer-schema-time-50: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP8-11 all have time_minutes=50');
