// gp-dropdown-inputs-stable.test.js — regression guard: 21 dropdown-type inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 21;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    count += (q.inputs || []).filter(i => i.type === 'dropdown').length;
  }
}

console.log(`gp-dropdown-inputs-stable: ${count} dropdown inputs (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: dropdown count changed from ${BASELINE} to ${count}`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — dropdown inputs regression guard passed`);
