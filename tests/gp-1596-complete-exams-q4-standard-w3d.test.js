// gp-1596-complete-exams-q4-standard-w3d.test.js
// Lock: Q4 standard must be W3.d in all 12 complete exams (discovered from 1592).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[3];
  if (q.standard === 'W3.d') pass++;
  else { fail++; failures.push(data.exam_id + ': Q4 standard=' + q.standard); }
}
console.log('gp-1596-q4-standard-w3d: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q4 standard=W3.d in all ' + pass + ' complete exams');
