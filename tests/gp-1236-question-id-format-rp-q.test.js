// gp-1236-question-id-format-rp-q.test.js
// Question IDs must match format rp{N}-q{M} exactly.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/^rp\d+-q\d+$/.test(q.id)) pass++;
    else { fail++; failures.push(file + ': id=' + q.id); }
  }
}
console.log('gp-1236-question-id-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question IDs match rp{N}-q{M} format');
