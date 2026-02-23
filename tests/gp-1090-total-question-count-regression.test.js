// gp-1090-total-question-count-regression.test.js
// Total questions across all 11 exams must be exactly 165.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 165;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += (data.questions || []).length;
}

console.log(`gp-1090-total-question-count-regression: total=${total} (expected ${EXPECTED})`);
if (total !== EXPECTED) {
  console.log(`  FAIL: expected ${EXPECTED}, got ${total}`);
  process.exit(1);
}
console.log(`OK -- total question count locked at ${EXPECTED} (11 exams x 15)`);
