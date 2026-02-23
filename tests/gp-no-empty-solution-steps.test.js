// gp-no-empty-solution-steps.test.js — no solution step should be an empty or whitespace-only string

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
    for (const step of (q.solution_steps || [])) {
      if (!step || String(step).trim() === '') {
        fail++;
        failures.push(`${file}: Q${q.id} has empty solution step`);
      } else { pass++; }
    }
  }
}

console.log(`gp-no-empty-solution-steps: ${pass} pass, ${fail} empty`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} solution steps are non-empty`);
