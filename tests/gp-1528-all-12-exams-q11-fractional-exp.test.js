// gp-1528-all-12-exams-q11-fractional-exp.test.js
// Q11 must be fractional-exp in all 12 exams (universal invariant).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q11 = data.questions[10];
  if (q11 && q11.type === 'fractional-exp') pass++;
  else { fail++; failures.push(data.exam_id + ': Q11=' + (q11 && q11.type)); }
}
console.log('gp-1528-all-12-q11-frac-exp: ' + pass + '/' + RP_FILES.length + ' pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q11=fractional-exp in all ' + pass + ' exams');
