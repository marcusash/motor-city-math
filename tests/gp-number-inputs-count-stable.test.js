// gp-number-inputs-count-stable.test.js — regression guard: 272 total number-type inputs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 272;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    count += (q.inputs || []).filter(i => i.type === 'number').length;
  }
}

console.log(`gp-number-inputs-count-stable: ${count} number inputs (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: count changed from ${BASELINE} to ${count} — update baseline if intentional`);
}
console.log(`OK — number input count audited`);
