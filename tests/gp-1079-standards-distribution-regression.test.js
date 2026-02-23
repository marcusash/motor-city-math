// gp-1079-standards-distribution-regression.test.js
// Lock the known standards distribution across all 11 exams.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = {
  'W3.b': 34, 'W3.d': 28, 'W2.b': 26, 'W3.a': 20, 'W3.c': 16,
  'W2.c': 11, 'W2.e': 11, 'W2.a': 8, 'W3.e': 6, 'W2.d': 5
};

const actual = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    actual[q.standard] = (actual[q.standard] || 0) + 1;
  }
}

let pass = 0, fail = 0;
const failures = [];

for (const [std, expected] of Object.entries(EXPECTED)) {
  const got = actual[std] || 0;
  if (got === expected) { pass++; }
  else { fail++; failures.push(`${std}: got ${got}, expected ${expected}`); }
}

console.log(`gp-1079-standards-distribution-regression: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- standards distribution locked (${pass} standards match expected counts)`);
