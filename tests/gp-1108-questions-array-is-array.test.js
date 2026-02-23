// gp-1108-questions-array-is-array.test.js
// questions field must be an array (not null/object).

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
  if (Array.isArray(data.questions)) { pass++; }
  else { fail++; failures.push(`${file}: questions is ${typeof data.questions} (expected Array)`); }
}

console.log(`gp-1108-questions-array-is-array: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have questions as Array type`);
