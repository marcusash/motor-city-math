// gp-1133-radio-inputs-total-regression.test.js
// Total radio inputs across all exams must stay at 5.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.flatMap(q => q.inputs || []).filter(i => i.type === 'radio').length;
}

const EXPECTED = 5;
console.log(`gp-1133-radio-inputs-total: ${total} radio inputs (expected ${EXPECTED})`);
if (total !== EXPECTED) { console.log(`  FAIL: expected ${EXPECTED}, got ${total}`); process.exit(1); }
console.log(`OK -- total radio inputs locked at ${EXPECTED}`);
