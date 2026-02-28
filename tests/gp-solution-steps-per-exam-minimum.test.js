// gp-solution-steps-per-exam-minimum.test.js — each exam must have at least 50 solution steps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_STEPS = 50;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let count = 0;
  for (const q of data.questions) {
    if (Array.isArray(q.solution_steps)) count += q.solution_steps.length;
  }
  if (count < MIN_STEPS) {
    fail++;
    failures.push(`${file}: only ${count} steps (min ${MIN_STEPS})`);
  } else { pass++; }
}

console.log(`gp-solution-steps-per-exam-minimum: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have >= ${MIN_STEPS} solution steps`);
