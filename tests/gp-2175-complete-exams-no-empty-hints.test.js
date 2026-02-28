// gp-2175-complete-exams-no-empty-hints.test.js
// No hint field should be empty or whitespace-only in any exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const emptyHint = data.questions.filter(q => q.hint && q.hint.trim() === '');
  if (emptyHint.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' empty hint Q' + emptyHint.map(q=>q.number).join(',')); }
}
console.log('gp-2175-no-empty-hints: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- No empty hint fields in all 12 exams');
