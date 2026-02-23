// gp-solution-steps-not-empty-strings.test.js — solution steps must not be empty strings

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
    for (const [i, step] of (q.solution_steps || []).entries()) {
      const text = typeof step === 'string' ? step : (step.text || '');
      if (!text.trim()) {
        fail++;
        failures.push(`${file}: Q${q.id} solution_step[${i}] is empty`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-not-empty-strings: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} solution steps are non-empty`);
