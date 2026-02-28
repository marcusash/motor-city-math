// gp-1165-section-d-question-count.test.js
// Section D must have exactly 2 questions per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.filter(q => q.section === 'D').length;
  if (n === 2) pass++;
  else { fail++; failures.push(file + ': Section D has ' + n + ' questions (expected 2)'); }
}
console.log('gp-1165-section-d-question-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 2 Section D questions');
