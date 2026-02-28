// gp-standards-total-165-stable.test.js — regression: all 165 questions have a standard assigned

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 165;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => typeof q.standard === 'string' && q.standard.trim()).length;
}

console.log(`gp-standards-total-165-stable: ${count} questions with standards (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  FAIL: not all questions have a standard (${BASELINE - count} missing)`);
  process.exit(1);
}
console.log(`  All ${count} questions have standards assigned`);
console.log(`OK — standards coverage regression guard passed`);
