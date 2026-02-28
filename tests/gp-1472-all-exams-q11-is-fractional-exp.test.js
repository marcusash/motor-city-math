// gp-1472-all-exams-q11-is-fractional-exp.test.js
// Q11 (index 10) must be 'fractional-exp' in all 11 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[10];
  if (q && q.type === 'fractional-exp') pass++;
  else { fail++; failures.push(data.exam_id + ': Q11 type=' + (q && q.type)); }
}
console.log('gp-1472-q11-is-fractional-exp: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q11 is fractional-exp in all 11 exams');
