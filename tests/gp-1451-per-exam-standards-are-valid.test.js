// gp-1451-per-exam-standards-are-valid.test.js
// All question standards must be one of the 10 valid values.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['W2.a','W2.b','W2.c','W2.d','W2.e','W3.a','W3.b','W3.c','W3.d','W3.e']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (VALID.has(q.standard)) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' standard="' + q.standard + '" is invalid'); }
  }
}
console.log('gp-1451-standards-are-valid: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' standards are within valid W2.a-W3.e set');
