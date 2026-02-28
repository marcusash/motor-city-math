// gp-1793-complete-exams-total-questions-180-lock.test.js
// Grand total of questions across all 12 complete exams = 180 (12 * 15).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0, examCount = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  total += data.questions.length;
  examCount++;
}
console.log('gp-1793-total-questions:', total, 'across', examCount, 'exams');
if (total !== 180) { console.log('FAIL: expected 180 got', total); process.exit(1); }
console.log('OK -- total questions locked at 180 (12 exams x 15)');
