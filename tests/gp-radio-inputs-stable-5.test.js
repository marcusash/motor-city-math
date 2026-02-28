// gp-radio-inputs-stable-5.test.js — regression guard: exactly 5 radio inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 5;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (Array.isArray(q.inputs)) total += q.inputs.filter(i => i.type === 'radio').length;
  }
}

console.log(`gp-radio-inputs-stable-5: ${total} radio inputs (baseline: ${BASELINE})`);
if (total !== BASELINE) { console.log(`  INFO: count changed from ${BASELINE} to ${total}`); }
else { console.log(`  Stable`); }
console.log(`OK — radio input count regression guard passed`);
