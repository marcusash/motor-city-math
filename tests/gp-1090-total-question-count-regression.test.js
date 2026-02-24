// gp-1090-total-question-count-regression.test.js
// Total questions across all exams. Updated for RP12 (12 exams x 15 = 180).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 15 * RP_FILES.length; // 15 questions per exam, dynamic total
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += (data.questions || []).length;
}

console.log(`gp-1090-total-question-count-regression: total=${total} (${RP_FILES.length} exams x 15 = ${EXPECTED})`);
if (total !== EXPECTED) {
  console.log(`  FAIL: expected ${EXPECTED}, got ${total}`);
  process.exit(1);
}
console.log(`OK -- total question count locked at ${EXPECTED} (${RP_FILES.length} exams x 15)`);
