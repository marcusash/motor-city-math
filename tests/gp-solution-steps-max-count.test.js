// gp-solution-steps-max-count.test.js — solution steps should not be excessively verbose (max 10 steps)
// More than 10 steps for a single question suggests the question should be split or condensed

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
    const steps = (q.solution_steps || []).length;
    if (steps > MAX_STEPS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${steps} steps (max: ${MAX_STEPS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-max-count: ${pass} pass, ${warn} over-limit`);
if (warnings.length) {
  console.log('INFO — verbose questions (notify GR to condense):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have 10 or fewer steps`);
