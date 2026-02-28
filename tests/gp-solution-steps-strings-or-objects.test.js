// gp-solution-steps-strings-or-objects.test.js — solution steps must be strings or objects with 'text' field

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
      if (typeof step === 'string') {
        pass++;
      } else if (typeof step === 'object' && step !== null && typeof step.text === 'string') {
        pass++;
      } else {
        fail++;
        failures.push(`${file}: Q${q.id} step is ${typeof step} (not string or {text})`);
      }
    }
  }
}

console.log(`gp-solution-steps-strings-or-objects: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} solution steps are valid format`);
