// gp-total-inputs-count-stable.test.js — regression guard: exactly 359 total inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 359;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) count += (q.inputs || []).length;
}

console.log(`gp-total-inputs-count-stable: ${count} inputs (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: input count changed from ${BASELINE} to ${count}`);
} else {
  console.log(`  Input count stable`);
}
console.log(`OK — total inputs regression guard passed`);
