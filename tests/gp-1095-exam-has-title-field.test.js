// gp-1095-exam-has-title-field.test.js
// All exams must have a non-empty title field.

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
  if (typeof data.title === 'string' && data.title.trim().length > 0) { pass++; }
  else { fail++; failures.push(`${file}: title="${data.title}" is missing/empty`); }
}

console.log(`gp-1095-exam-has-title-field: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have non-empty title field`);
