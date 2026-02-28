// gp-exam-subtitle-is-string.test.js — subtitle field should be a non-empty string

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
  const sub = data.subtitle;
  if (typeof sub !== 'string' || sub.trim().length === 0) {
    fail++;
    failures.push(`${file}: subtitle='${sub}' (must be non-empty string)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-subtitle-is-string: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have string subtitle`);
