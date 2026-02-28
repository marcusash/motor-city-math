// gp-1673-complete-exams-question-number-sequential.test.js
// q.number must be sequential 1-15 per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const numbers = data.questions.map(q => q.number);
  const expected = Array.from({length: 15}, (_, i) => i + 1);
  const ok = JSON.stringify(numbers) === JSON.stringify(expected);
  if (ok) pass++;
  else { fail++; failures.push(data.exam_id + ': numbers=' + numbers.join(',')); }
}
console.log('gp-1673-question-number-sequential: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all complete exams have sequential question numbers 1-15 (' + pass + ' checked)');
