// gp-1287-no-null-question-ids.test.js
// No question ID must be null or empty.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.id && typeof q.id === 'string' && q.id.trim().length > 0) pass++;
    else { fail++; failures.push(file + ': question has null/empty id'); }
  }
}
console.log('gp-1287-no-null-question-ids: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' questions have non-null IDs');
