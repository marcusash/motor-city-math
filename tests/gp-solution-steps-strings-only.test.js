// gp-solution-steps-strings-only.test.js — all solution steps must be strings (not objects/numbers)

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
      if (typeof step !== 'string') {
        fail++;
        failures.push(`${file}: Q${q.id} step is ${typeof step}: ${JSON.stringify(step).substring(0,40)}`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-strings-only: ${pass} pass, ${fail} non-string`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} solution steps are strings`);
