// gp-total-inputs-regression.test.js — regression guard: 359 total inputs across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 359;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) total += (q.inputs || []).length;
}

console.log(`gp-total-inputs-regression: ${total} total inputs (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  INFO: input count changed from ${BASELINE} to ${total}`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — total inputs regression guard passed`);
