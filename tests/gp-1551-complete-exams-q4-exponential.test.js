// gp-1551-complete-exams-q4-exponential.test.js
// Q4 must be 'exponential' type in all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q4 = data.questions[3];
  if (q4 && q4.type === 'exponential') pass++;
  else { fail++; failures.push(data.exam_id + ': Q4 type=' + (q4 && q4.type)); }
}
console.log('gp-1551-q4-exponential: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q4=exponential in all ' + pass + ' complete exams');
