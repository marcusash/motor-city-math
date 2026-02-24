// gp-1794-complete-exams-question-numbers-sequential.test.js
// Question numbers must be sequential 1-15 within each exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const nums = data.questions.map(q => q.number);
  const ok = nums.every((n, i) => n === i + 1);
  if (ok) pass++;
  else { fail++; failures.push(data.exam_id + ' numbers: ' + nums.join(',')); }
}
console.log('gp-1794-sequential-numbers: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exams have sequential question numbers 1-15 (' + pass + ' exams)');
