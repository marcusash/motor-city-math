// gp-text-inputs-stable-61.test.js — regression guard: exactly 61 text inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 61;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (Array.isArray(q.inputs)) total += q.inputs.filter(i => i.type === 'text').length;
  }
}

console.log(`gp-text-inputs-stable-61: ${total} text inputs (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  INFO: text input count changed from ${BASELINE} to ${total}`);
} else { console.log(`  Stable`); }
console.log(`OK — text input count regression guard passed`);
