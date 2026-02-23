// gp-solution-steps-per-question-minimum.test.js — each question must have at least 1 solution step

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
    const steps = q.solution_steps || [];
    if (steps.length >= 1) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} has no solution steps`); }
  }
}

console.log(`gp-solution-steps-per-question-minimum: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have at least 1 solution step`);
