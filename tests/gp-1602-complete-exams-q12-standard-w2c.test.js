// gp-1602-complete-exams-q12-standard-w2c.test.js
// Lock: Q12 standard must be W2.c in all 12 complete exams (confirmed from 1598).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[11];
  if (q.standard === 'W2.c') pass++;
  else { fail++; failures.push(data.exam_id + ': Q12 standard=' + q.standard); }
}
console.log('gp-1602-q12-standard-w2c: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q12 standard=W2.c in all ' + pass + ' complete exams');
