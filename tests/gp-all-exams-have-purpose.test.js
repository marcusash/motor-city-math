// gp-all-exams-have-purpose.test.js — every exam must have a non-empty purpose field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (!data.purpose || String(data.purpose).trim() === '') {
    fail++;
    failures.push(`${file}: purpose field is missing or blank`);
  } else { pass++; }
}

console.log(`gp-all-exams-have-purpose: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have non-empty purpose`);
