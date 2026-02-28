// gp-1625-complete-exams-all-q4-type-exponential-confirmed.test.js
// Confirmed final lock: Q4 must be 'exponential' type AND W3.d standard in all 12 complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[3];
  if (q.type === 'exponential' && q.standard === 'W3.d') pass++;
  else { fail++; failures.push(data.exam_id + ': Q4 type=' + q.type + ' std=' + q.standard); }
}
console.log('gp-1625-q4-type-std-lock: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q4=exponential/W3.d confirmed in all ' + pass + ' complete exams');
