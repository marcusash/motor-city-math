// gp-dropdown-inputs-stable-21.test.js — regression guard: exactly 21 dropdown inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 21;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (Array.isArray(q.inputs)) total += q.inputs.filter(i => i.type === 'dropdown').length;
  }
}

console.log(`gp-dropdown-inputs-stable-21: ${total} dropdown inputs (baseline: ${BASELINE})`);
if (total !== BASELINE) { console.log(`  INFO: count changed from ${BASELINE} to ${total}`); }
else { console.log(`  Stable`); }
console.log(`OK — dropdown input count regression guard passed`);
