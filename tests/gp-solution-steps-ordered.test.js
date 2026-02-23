// gp-solution-steps-ordered.test.js — verify solution_steps is an array and steps are non-empty strings

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps;
    
    if (!Array.isArray(steps)) {
      fail++;
      issues.push(`${file}: Q${q.id} solution_steps is not an array (got ${typeof steps})`);
      continue;
    }
    
    let qOk = true;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (typeof step !== 'string' || !step.trim()) {
        fail++;
        issues.push(`${file}: Q${q.id} step[${i}] is empty or not a string`);
        qOk = false;
      }
    }
    if (qOk) pass++;
  }
}

console.log(`gp-solution-steps-ordered: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have valid solution_steps arrays`);
