// gp-2034-complete-exams-prompt-field-present.test.js
// Every question must have a non-empty prompt field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.prompt === 'string' && q.prompt.trim().length > 0) pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+' prompt='+typeof q.prompt); }
  }
}
console.log('gp-2034-prompt-present: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 180 questions have non-empty prompt');
