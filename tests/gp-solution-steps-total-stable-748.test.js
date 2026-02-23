// gp-solution-steps-total-stable-748.test.js — regression guard: exactly 748 total solution steps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BASELINE = 748;
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    total += (q.solution_steps || []).length;
  }
}

console.log(`gp-solution-steps-total-stable-748: ${total} steps (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  FAIL: step count changed from ${BASELINE} to ${total}`);
  process.exit(1);
}
console.log(`OK — total solution steps regression guard passed`);
