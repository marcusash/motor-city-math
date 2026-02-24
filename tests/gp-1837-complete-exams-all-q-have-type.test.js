// gp-1837-complete-exams-all-q-have-type-string.test.js
// Every question must have a type field that is a non-empty string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (typeof q.type === 'string' && q.type.trim().length >= 2) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' type=' + JSON.stringify(q.type)); }
  }
}
console.log('gp-1837-all-q-type-string: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all questions have non-empty type strings (' + pass + ' questions)');
