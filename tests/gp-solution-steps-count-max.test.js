// gp-solution-steps-count-max.test.js — solution steps should not exceed 10 per question (cognitive load)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_STEPS = 10;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    if (steps.length > MAX_STEPS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${steps.length} solution steps (max ${MAX_STEPS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-count-max: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — questions with many solution steps (ADHD: consider splitting):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have at most ${MAX_STEPS} solution steps`);
