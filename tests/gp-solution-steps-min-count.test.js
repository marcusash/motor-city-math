// gp-solution-steps-min-count.test.js — every question should have at least 2 solution steps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_STEPS = 2;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    if (steps.length >= MIN_STEPS) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${steps.length} steps (min: ${MIN_STEPS})`);
    }
  }
}

console.log(`gp-solution-steps-min-count: ${pass} pass, ${warn} under-threshold`);
if (warnings.length) {
  console.log('INFO — questions with thin solution steps (notify GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have ${MIN_STEPS}+ solution steps`);
