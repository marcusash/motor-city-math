// gp-1159-question-type-is-string.test.js
// Every question type field must be a non-empty string.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (typeof q.type === 'string' && q.type.trim().length > 0) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' type is not a non-empty string'); }
  }
}
console.log('gp-1159-question-type-is-string: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question types are valid non-empty strings');
