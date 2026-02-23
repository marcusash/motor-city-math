// gp-all-exams-have-created-field.test.js — created date field must exist in all exams

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
  if (!data.created || typeof data.created !== 'string' || data.created.trim() === '') {
    fail++;
    failures.push(`${file}: missing or empty created field`);
  } else {
    pass++;
  }
}

console.log(`gp-all-exams-have-created-field: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have a created date field`);
