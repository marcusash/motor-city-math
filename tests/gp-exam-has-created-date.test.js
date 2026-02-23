// gp-exam-has-created-date.test.js — every exam must have a created date in YYYY-MM-DD format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.created === 'string' && DATE_REGEX.test(data.created)) { pass++; }
  else { fail++; failures.push(`${file}: created="${data.created}" (expected YYYY-MM-DD)`); }
}

console.log(`gp-exam-has-created-date: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have YYYY-MM-DD created date`);
