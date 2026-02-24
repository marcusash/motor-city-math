// gp-1527-all-12-exams-q4-exponential.test.js
// Q4 must be exponential in all 12 exams (universal invariant).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q4 = data.questions[3];
  if (q4 && q4.type === 'exponential') pass++;
  else { fail++; failures.push(data.exam_id + ': Q4=' + (q4 && q4.type)); }
}
console.log('gp-1527-all-12-q4-exponential: ' + pass + '/' + RP_FILES.length + ' pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q4=exponential in all ' + pass + ' exams');
