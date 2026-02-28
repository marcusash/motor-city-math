// gp-solution-steps-strings.test.js — all solution steps are non-empty strings
// Empty or non-string steps render as blank lines in the solution viewer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    const steps = q.solution_steps || [];
    steps.forEach((step, i) => {
      if (typeof step !== 'string' || step.trim().length === 0) {
        fail++;
        violations.push(`${file} Q${q.id || q.number} step[${i}]: not a non-empty string`);
      } else {
        pass++;
      }
    });
  }
}

console.log(`gp-solution-steps-strings: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all solution steps are non-empty strings');
