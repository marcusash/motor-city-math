// gp-inputs-count-is-stable.test.js — total input count should remain stable (359) — regression guard

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_TOTAL = 359; // established baseline
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    total += (q.inputs || []).length;
  }
}

console.log(`gp-inputs-count-is-stable: ${total} inputs (baseline: ${EXPECTED_TOTAL})`);
if (Math.abs(total - EXPECTED_TOTAL) > 5) {
  console.log(`  FAIL: total inputs ${total} deviates from baseline ${EXPECTED_TOTAL} by more than 5`);
  process.exit(1);
}
if (total !== EXPECTED_TOTAL) {
  console.log(`  INFO: ${total} != ${EXPECTED_TOTAL} exactly (within tolerance)`);
}
console.log(`OK — input count stable (${total} total)`);
