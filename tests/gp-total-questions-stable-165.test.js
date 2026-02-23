// gp-total-questions-stable-165.test.js — regression guard: exactly 165 total questions across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 165;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.length;
}

console.log(`gp-total-questions-stable-165: ${total} total questions (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  FAIL: total changed from ${BASELINE} to ${total}`);
  process.exit(1);
}
console.log(`OK — total question count regression guard passed`);
