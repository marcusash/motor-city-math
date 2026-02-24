// gp-1387-question-id-format.test.js
// All question ids must match rp{N}-q{M} format.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const ID_RE = /^rp\d+-q\d+$/;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (ID_RE.test(q.id || '')) pass++;
    else { fail++; failures.push(file + ': id="' + q.id + '"'); }
  }
}
console.log('gp-1387-question-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question ids match rp{N}-q{M} format');
