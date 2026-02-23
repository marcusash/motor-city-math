// gp-exam-version-is-2-string.test.js — version field must be string "2.0" in every exam

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
  const v = data.version;
  if (v !== '2.0') {
    fail++;
    failures.push(`${file}: version="${v}" (expected "2.0")`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-version-is-2-string: ${pass} pass, ${fail} wrong`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have version="2.0"`);
