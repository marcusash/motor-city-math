// gp-1552-complete-exams-q11-fractional-exp.test.js
// Q11 must be 'fractional-exp' type in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q11 = data.questions[10];
  if (q11 && q11.type === 'fractional-exp') pass++;
  else { fail++; failures.push(data.exam_id + ': Q11 type=' + (q11 && q11.type)); }
}
console.log('gp-1552-q11-fractional-exp: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q11=fractional-exp in all ' + pass + ' complete exams');
