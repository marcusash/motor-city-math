// gp-question-count-is-stable.test.js — total question count (165) should not drop — regression guard

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_TOTAL = 165;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += (data.questions || []).length;
}

console.log(`gp-question-count-is-stable: ${total} questions (baseline: ${EXPECTED_TOTAL})`);
if (total < EXPECTED_TOTAL) {
  console.log(`  FAIL: only ${total} questions, down from baseline ${EXPECTED_TOTAL} — questions were deleted!`);
  process.exit(1);
}
if (total > EXPECTED_TOTAL) {
  console.log(`  INFO: ${total} questions (${total - EXPECTED_TOTAL} added since baseline)`);
}
console.log(`OK — question count stable at ${total}`);
