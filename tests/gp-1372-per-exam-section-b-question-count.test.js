// gp-1372-per-exam-section-b-question-count.test.js
// Every exam must have exactly 8 questions in Section B.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.section === 'B').length;
  if (count === 8) pass++;
  else { fail++; failures.push(file + ': section B count=' + count); }
}
console.log('gp-1372-per-exam-section-b-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 8 section B questions');
