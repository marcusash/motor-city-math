// gp-1601-complete-exams-q11-standard-w3b.test.js
// Lock: Q11 standard must be W3.b in all 12 complete exams (confirmed from 1597).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[10];
  if (q.standard === 'W3.b') pass++;
  else { fail++; failures.push(data.exam_id + ': Q11 standard=' + q.standard); }
}
console.log('gp-1601-q11-standard-w3b: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q11 standard=W3.b in all ' + pass + ' complete exams');
