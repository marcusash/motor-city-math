// gp-solution-steps-min-3.test.js — questions should have at least 3 solution steps for meaningful scaffolding

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_STEPS = 3;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    if (steps.length < MIN_STEPS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has only ${steps.length} steps (min ${MIN_STEPS} recommended)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-min-3: ${pass} pass, ${warn} below minimum`);
if (warnings.length) {
  console.log('INFO — questions with fewer than 3 solution steps:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have 3+ solution steps`);
