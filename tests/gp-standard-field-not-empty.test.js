// gp-standard-field-not-empty.test.js — every question must have a non-empty standard field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = (q.standard || '').trim();
    if (!std) {
      fail++;
      failures.push(`${file}: Q${q.id} missing standard field`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-standard-field-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have a standard field`);
