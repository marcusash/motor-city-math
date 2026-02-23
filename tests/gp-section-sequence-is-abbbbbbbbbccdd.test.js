// gp-section-sequence-is-abbbbbbbbbccdd.test.js — verify section ordering AAABBBBBBBBCCDD for each exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 'AAABBBBBBBBCCDD';
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const actual = data.questions.map(q => q.section).join('');
  if (actual === EXPECTED) { pass++; }
  else { fail++; failures.push(`${file}: got "${actual}" (expected "${EXPECTED}")`); }
}

console.log(`gp-section-sequence-is-abbbbbbbbbccdd: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have correct section sequence AAABBBBBBBBCCDD`);
