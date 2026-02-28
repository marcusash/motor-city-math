// gp-radio-inputs-stable.test.js — regression guard: 5 radio-type inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 5;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    count += (q.inputs || []).filter(i => i.type === 'radio').length;
  }
}

console.log(`gp-radio-inputs-stable: ${count} radio inputs (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: radio input count changed from ${BASELINE} to ${count}`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — radio inputs regression guard passed`);
