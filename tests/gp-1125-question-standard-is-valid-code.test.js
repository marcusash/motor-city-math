// gp-1125-question-standard-is-valid-code.test.js
// standard field must be one of the known W2/W3 codes.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_STANDARDS = new Set(['W2.a','W2.b','W2.c','W2.d','W2.e','W3.a','W3.b','W3.c','W3.d','W3.e']);

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (VALID_STANDARDS.has(q.standard)) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} standard="${q.standard}" not in valid set`); }
  }
}

console.log(`gp-1125-question-standard-is-valid-code: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} questions use valid standard codes`);
