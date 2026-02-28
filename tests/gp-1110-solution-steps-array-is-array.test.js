// gp-1110-solution-steps-array-is-array.test.js
// solution_steps on each question must be an array.

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
  for (const q of data.questions) {
    if (Array.isArray(q.solution_steps)) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} solution_steps is ${typeof q.solution_steps} (expected Array)`); }
  }
}

console.log(`gp-1110-solution-steps-array-is-array: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} questions have solution_steps as Array type`);
