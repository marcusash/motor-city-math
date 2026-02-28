// gp-solution-steps-array-type.test.js — solution_steps must be an array (not a string or null)

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
  for (const q of data.questions) {
    const steps = q.solution_steps;
    if (steps !== undefined && !Array.isArray(steps)) {
      fail++;
      failures.push(`${file}: Q${q.id} solution_steps is ${typeof steps} (expected array)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-array-type: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have array-type solution_steps`);
