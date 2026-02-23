// gp-solution-steps-are-strings.test.js — all solution steps must be strings (not objects/numbers)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!Array.isArray(q.solution_steps)) continue;
    for (let i = 0; i < q.solution_steps.length; i++) {
      if (typeof q.solution_steps[i] !== 'string') {
        fail++;
        failures.push(`${file}: ${q.id} step[${i}] is ${typeof q.solution_steps[i]}`);
      } else { pass++; }
    }
  }
}

console.log(`gp-solution-steps-are-strings: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} solution steps are strings`);
