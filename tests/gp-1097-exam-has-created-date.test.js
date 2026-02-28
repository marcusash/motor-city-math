// gp-1097-exam-has-created-date.test.js
// All exams must have a 'created' field in YYYY-MM-DD format.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.created === 'string' && DATE_RE.test(data.created)) { pass++; }
  else { fail++; failures.push(`${file}: created="${data.created}" not in YYYY-MM-DD format`); }
}

console.log(`gp-1097-exam-has-created-date: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have created date in YYYY-MM-DD format`);
