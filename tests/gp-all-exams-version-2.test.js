// gp-all-exams-version-2.test.js — all 11 exams must have version "2.0"

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
  if (data.version !== '2.0') {
    fail++;
    failures.push(`${file}: version="${data.version}" (expected "2.0")`);
  } else { pass++; }
}

console.log(`gp-all-exams-version-2: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams are version "2.0"`);
