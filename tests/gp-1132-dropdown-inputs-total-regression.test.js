// gp-1132-dropdown-inputs-total-regression.test.js
// Total dropdown inputs across all exams must stay at 21.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.flatMap(q => q.inputs || []).filter(i => i.type === 'dropdown').length;
}

const EXPECTED = 21;
console.log(`gp-1132-dropdown-inputs-total: ${total} dropdown inputs (expected ${EXPECTED})`);
if (total !== EXPECTED) { console.log(`  FAIL: expected ${EXPECTED}, got ${total}`); process.exit(1); }
console.log(`OK -- total dropdown inputs locked at ${EXPECTED}`);
