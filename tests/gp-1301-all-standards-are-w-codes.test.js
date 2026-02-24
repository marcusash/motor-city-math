// gp-1301-all-standards-are-w-codes.test.js
// All 165 standards must match W{digit}.{letter} format.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/^W\d\.[a-z]$/.test(q.standard || '')) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' standard=' + q.standard); }
  }
}
console.log('gp-1301-standards-w-codes: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' standards match W{digit}.{letter} format');
