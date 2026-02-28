// gp-1881-complete-exams-total-questions-180-lock.test.js
// Total questions across 12 complete exams = 180.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0, exams = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  total += data.questions.length; exams++;
}
console.log('gp-1881-total-questions:', total, 'across', exams, 'exams');
if (exams !== 12 || total !== 180) { console.log('FAIL: expected 12 exams 180 questions'); process.exit(1); }
console.log('OK -- 180 total questions across 12 complete exams');
