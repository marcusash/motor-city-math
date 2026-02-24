// gp-1471-all-exams-q4-is-exponential.test.js
// Q4 (index 3) must be 'exponential' in all 11 exams -- perfectly consistent.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[3];
  if (q && q.type === 'exponential') pass++;
  else { fail++; failures.push(data.exam_id + ': Q4 type=' + (q && q.type)); }
}
console.log('gp-1471-q4-is-exponential: ' + pass + '/11 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q4 is exponential in all 11 exams');
