// gp-1375-per-exam-total-questions-locked.test.js
// Every exam must have exactly 15 total questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = (data.questions || []).length;
  if (count === 15) pass++;
  else { fail++; failures.push(file + ': questions count=' + count); }
}
console.log('gp-1375-per-exam-total-questions: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 15 questions');
