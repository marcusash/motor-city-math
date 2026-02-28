// gp-1262-all-questions-have-standard.test.js
// All 165 questions must have a non-empty standard field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (typeof q.standard === 'string' && q.standard.trim().length > 0) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' standard=' + q.standard); }
  }
}
console.log('gp-1262-all-questions-have-standard: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' questions have non-empty standard');
