// gp-1755-complete-exams-exam-count-lock.test.js
// Exactly 12 complete exams must exist.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let complete = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length === 15) complete++;
}
console.log('gp-1755-exam-count: complete=' + complete);
if (complete !== 12) { console.log('FAIL: expected 12 complete exams, got ' + complete); process.exit(1); }
console.log('OK -- exactly 12 complete exams (15 questions each)');
