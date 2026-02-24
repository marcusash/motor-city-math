// gp-1386-no-emoji-in-standard-field.test.js
// Standard field should contain only alphanumeric characters and dots (W2.a format).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const STANDARD_RE = /^W\d+\.[a-z]$/;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (STANDARD_RE.test(q.standard || '')) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' standard="' + q.standard + '"'); }
  }
}
console.log('gp-1386-standard-field-format: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' standards match W{N}.{letter} format');
