// gp-exam-version-is-string.test.js — version field must be a string (not a number like 2 vs "2.0")

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
  if (typeof v !== 'string') {
    fail++;
    failures.push(`${file}: version=${JSON.stringify(v)} is ${typeof v} (expected string like "2.0")`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-version-is-string: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have string version field`);
