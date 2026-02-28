// gp-2049-complete-exams-title-field-present.test.js
// All 12 complete exams must have a non-empty exam-level title field.
// Note: question-level title is absent (schema gap) -- this is exam-level only.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (typeof data.title === 'string' && data.title.length > 0) pass++;
  else { fail++; failures.push(file + ' title=' + data.title); }
}
console.log('gp-2049-exam-title: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have non-empty exam-level title');
