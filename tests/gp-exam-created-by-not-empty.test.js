// gp-exam-created-by-not-empty.test.js — created_by field must be present and non-empty

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
  const cb = data.created_by;
  if (!cb || typeof cb !== 'string' || cb.trim() === '') {
    fail++;
    failures.push(`${file}: created_by='${cb}' is missing or empty`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-created-by-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have non-empty created_by field`);
