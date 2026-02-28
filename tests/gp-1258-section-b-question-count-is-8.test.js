// gp-1258-section-b-question-count-is-8.test.js
// Section B must have exactly 8 questions in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.filter(q => q.section === 'B').length;
  if (n === 8) pass++;
  else { fail++; failures.push(file + ': Section B count=' + n); }
}
console.log('gp-1258-section-b-count-is-8: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 8 Section B questions');
