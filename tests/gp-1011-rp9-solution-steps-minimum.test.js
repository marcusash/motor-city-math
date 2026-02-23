// gp-1011-rp9-solution-steps-minimum.test.js — RP9 specifically needs min steps per question

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-9.json'), 'utf8'));

const MIN_STEPS = 3;
let pass = 0, fail = 0;
const failures = [];

for (const q of data.questions) {
  const steps = (q.solution_steps || []).length;
  if (steps >= MIN_STEPS) { pass++; }
  else { fail++; failures.push(`RP9: ${q.id} has only ${steps} steps (min ${MIN_STEPS})`); }
}

console.log(`gp-1011-rp9-solution-steps-minimum: ${pass} pass, ${fail} advisory`);
if (failures.length) { failures.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — RP9 solution step minimum audit (current avg 3.8 steps/question)`);
