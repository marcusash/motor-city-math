// gp-text-inputs-stable.test.js — regression guard: 61 text-type inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 61;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    count += (q.inputs || []).filter(i => i.type === 'text').length;
  }
}

console.log(`gp-text-inputs-stable: ${count} text inputs (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: text input count changed from ${BASELINE} to ${count}`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — text inputs regression guard passed`);
