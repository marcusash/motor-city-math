// gp-1032-exam-total-inputs-regression.test.js — total inputs across all exams = 359

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 359;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) { total += (q.inputs || []).length; }
}

console.log(`gp-1032-exam-total-inputs-regression: total=${total} (expected ${EXPECTED})`);
if (total !== EXPECTED) {
  console.log(`  FAIL: expected ${EXPECTED} inputs, got ${total}`);
  process.exit(1);
}
console.log(`OK — total input count locked at ${EXPECTED}`);
