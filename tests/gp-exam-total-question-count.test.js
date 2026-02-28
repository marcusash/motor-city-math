// gp-exam-total-question-count.test.js — total questions across all 11 exams should be exactly 165

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_TOTAL = 165; // 11 exams × 15 questions

let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += (data.questions || []).length;
}

console.log(`gp-exam-total-question-count: total=${total} (expected ${EXPECTED_TOTAL})`);
if (total !== EXPECTED_TOTAL) {
  console.log(`  FAIL: ${total} != ${EXPECTED_TOTAL}`);
  process.exit(1);
}
console.log(`OK — exactly ${total} questions across ${RP_FILES.length} exams`);
