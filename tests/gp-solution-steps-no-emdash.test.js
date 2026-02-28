// gp-solution-steps-no-emdash.test.js — solution_steps must not contain em dashes
// This is a targeted version of the comprehensive test for CI integration

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EMDASH_RE = /[—–]/;

let stepPass = 0;
let stepFail = 0;
let questionsChecked = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    questionsChecked++;
    const steps = q.solution_steps || [];
    for (let i = 0; i < steps.length; i++) {
      if (EMDASH_RE.test(steps[i])) {
        stepFail++;
        issues.push(`${file}: Q${q.id} step[${i}]: "${steps[i].substring(0, 80)}"`);
      } else {
        stepPass++;
      }
    }
  }
}

console.log(`gp-solution-steps-no-emdash: ${stepPass} steps pass, ${stepFail} violations across ${questionsChecked} questions`);
if (issues.length) {
  console.log('EM DASH VIOLATIONS in solution_steps (must fix):');
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${stepPass} solution steps are em-dash free`);
