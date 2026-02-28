// gp-1261-section-d-question-count-is-2.test.js
// Section D must have exactly 2 questions in every exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.filter(q => q.section === 'D').length;
  if (n === 2) pass++;
  else { fail++; failures.push(file + ': Section D count=' + n); }
}
console.log('gp-1261-section-d-count-is-2: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have exactly 2 Section D questions');
