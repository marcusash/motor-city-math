// gp-solution-steps-non-empty.test.js — solution step text must not be empty

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
    for (let i = 0; i < (q.solution_steps || []).length; i++) {
      const step = q.solution_steps[i];
      const text = typeof step === 'string' ? step : (step && step.text) || '';
      if (text.trim().length === 0) {
        fail++;
        issues.push(`${file}: Q${q.id} step ${i + 1} is empty`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-non-empty: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} solution steps have content`);
