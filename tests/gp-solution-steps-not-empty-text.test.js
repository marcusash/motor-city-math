// gp-solution-steps-not-empty-text.test.js — solution step text must not be empty or whitespace-only

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      const text = (typeof step === 'string' ? step : (step.text || '')).trim();
      if (!text) {
        fail++;
        failures.push(`${file}: Q${q.id} has empty solution step`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-not-empty-text: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} solution steps have non-empty text`);
