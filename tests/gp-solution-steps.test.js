#!/usr/bin/env node
// gp-solution-steps.test.js — All questions have >= 3 solution steps
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0;
const files = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(DATA, file)));
  for (const q of (json.questions || [])) {
    const steps = q.solution_steps || [];
    if (steps.length < 3) { console.log(`FAIL: ${file} ${q.id} has only ${steps.length} steps`); fail++; }
    else pass++;
  }
}
console.log(`\ngp-solution-steps: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);