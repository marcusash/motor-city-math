// gp-total-inputs-stable-359.test.js — regression guard: exactly 359 inputs total across all exams

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
  for (const q of data.questions) {
    if (Array.isArray(q.inputs)) total += q.inputs.length;
  }
}

console.log(`gp-total-inputs-stable-359: ${total} total inputs (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  WARN: input count changed from ${BASELINE} to ${total} — verify intentional`);
  process.exit(1);
}
console.log(`  Stable`);
console.log(`OK — total inputs regression guard passed (${BASELINE})`);
