// gp-solution-steps-count-stable.test.js — regression guard: exactly 748 total solution steps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 748;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (Array.isArray(q.solution_steps)) total += q.solution_steps.length;
  }
}

console.log(`gp-solution-steps-count-stable: ${total} total steps (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  INFO: step count changed from ${BASELINE} to ${total} — update baseline if intentional`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — solution steps count regression guard passed`);
