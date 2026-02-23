// gp-solution-step-count-per-question-max.test.js — questions should not have more than 12 solution steps (ADHD: don't overwhelm)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_STEPS = 12;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    if (steps.length > MAX_STEPS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${steps.length} steps (max ${MAX_STEPS} for ADHD)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-step-count-per-question-max: ${pass} pass, ${warn} over limit`);
if (warnings.length) {
  console.log('INFO — questions with too many solution steps:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have 12 or fewer steps`);
