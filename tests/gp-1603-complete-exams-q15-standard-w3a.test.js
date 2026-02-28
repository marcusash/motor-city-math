// gp-1603-complete-exams-q15-standard-w3a.test.js
// Lock: Q15 standard must be W3.a in all 12 complete exams (confirmed from 1599).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[14];
  if (q.standard === 'W3.a') pass++;
  else { fail++; failures.push(data.exam_id + ': Q15 standard=' + q.standard); }
}
console.log('gp-1603-q15-standard-w3a: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 standard=W3.a in all ' + pass + ' complete exams');
