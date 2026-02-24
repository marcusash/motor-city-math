// gp-1090-total-question-count-regression.test.js
// Complete exams (15 questions each) must have total = complete_count x 15.
// Incomplete exams (like RP13 in progress) are excluded.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let completeExams = 0, incompleteExams = 0, total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const qCount = (data.questions || []).length;
  if (qCount === 15) { completeExams++; total += qCount; }
  else { incompleteExams++; }
}

const expected = completeExams * 15;
console.log(`gp-1090-total-question-count-regression: ${completeExams} complete exams x 15 = ${total} questions (${incompleteExams} incomplete exams skipped)`);
if (total !== expected) {
  console.log(`  FAIL: expected ${expected}, got ${total}`);
  process.exit(1);
}
console.log(`OK -- total question count locked at ${total} (${completeExams} complete exams x 15)`);
