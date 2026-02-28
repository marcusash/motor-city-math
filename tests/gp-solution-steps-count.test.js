// gp-solution-steps-count.test.js — every solution_steps array has >= 3 steps
// Fewer than 3 steps means Kai can't follow the work; this is an ADHD support requirement

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const MIN_STEPS = 3;

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (!q.solution_steps) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: missing solution_steps`);
    } else if (!Array.isArray(q.solution_steps)) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: solution_steps is not an array`);
    } else if (q.solution_steps.length < MIN_STEPS) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: solution_steps has ${q.solution_steps.length} steps (min ${MIN_STEPS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-count: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have >= ${MIN_STEPS} solution steps`);
