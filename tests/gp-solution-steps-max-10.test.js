// gp-solution-steps-max-10.test.js — solution_steps should not exceed 10 per question (ADHD: keep concise)

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
      warnings.push(`${file}: Q${q.id} has ${steps.length} solution steps (ADHD: max ${MAX_STEPS} recommended)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-max-10: ${pass} pass, ${warn} over limit`);
if (warnings.length) {
  console.log('INFO — questions with >10 solution steps:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have <= ${MAX_STEPS} solution steps`);
