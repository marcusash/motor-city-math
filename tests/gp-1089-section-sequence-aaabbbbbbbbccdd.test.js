// gp-1089-section-sequence-aaabbbbbbbbccdd.test.js
// Verify exact section sequence: AAA (3) BBBBBBBB (8) CC (2) DD (2) = 15 total

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 'AAABBBBBBBBCCDD'; // 3A + 8B + 2C + 2D = 15
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const seq = data.questions.map(q => q.section).join('');
  if (seq === EXPECTED) { pass++; }
  else { fail++; failures.push(`${file}: section sequence "${seq}" (expected "${EXPECTED}")`); }
}

console.log(`gp-1089-section-sequence-aaabbbbbbbbccdd: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have exact section sequence ${EXPECTED}`);
