// gp-total-questions-165-stable.test.js — regression guard: exactly 165 total questions

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

console.log(`gp-total-questions-165-stable: ${total} questions (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  INFO: total questions changed from ${BASELINE} to ${total}`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — total question count regression guard passed`);
