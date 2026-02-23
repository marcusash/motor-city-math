// gp-section-order-aaabbbbbbbbccdd.test.js — verify section sequence is exactly AAABBBBBBBBCCDD for every exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 'AAABBBBBBBBCCDD';
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const actual = data.questions.map(q => q.section).join('');
  if (actual !== EXPECTED) {
    fail++;
    failures.push(`${file}: section order "${actual}" (expected "${EXPECTED}")`);
  } else {
    pass++;
  }
}

console.log(`gp-section-order-aaabbbbbbbbccdd: ${pass} pass, ${fail} wrong order`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have section order AAABBBBBBBBCCDD`);
