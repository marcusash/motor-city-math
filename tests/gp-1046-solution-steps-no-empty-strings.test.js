// gp-1046-solution-steps-no-empty-strings.test.js — solution steps with whitespace-only content are invalid

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
    for (let i = 0; i < (q.solution_steps || []).length; i++) {
      const step = q.solution_steps[i];
      if (typeof step === 'string' && step.trim().length > 0) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id} step[${i}] is whitespace-only: "${step}"`); }
    }
  }
}

console.log(`gp-1046-solution-steps-no-empty-strings: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} solution steps have non-whitespace content`);
