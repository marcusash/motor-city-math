// gp-standard-whitelist.test.js — all question standards match known W2/W3 codes
// Unknown standards could indicate data entry errors or incorrect curriculum mapping

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

// Valid standards from data/standards.json
const VALID_STANDARDS = new Set(['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e', 'W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e']);

let pass = 0;
let fail = 0;
const violations = [];
const foundStandards = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (!q.standard) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: missing standard field`);
      continue;
    }
    foundStandards.add(q.standard);
    if (!VALID_STANDARDS.has(q.standard)) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: unknown standard "${q.standard}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-standard-whitelist: ${pass}/${pass + fail} pass`);
console.log(`Standards found: ${[...foundStandards].sort().join(', ')}`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all question standards are valid W2/W3 codes');
