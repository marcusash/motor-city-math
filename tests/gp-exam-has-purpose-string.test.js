// gp-exam-has-purpose-string.test.js — purpose field should be a descriptive string

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
  const p = data.purpose;
  if (typeof p !== 'string' || p.trim().length < 10) {
    fail++;
    failures.push(`${file}: purpose='${p}' must be a string with at least 10 chars`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-has-purpose-string: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have descriptive purpose string`);
