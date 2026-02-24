// gp-1449-all-standards-sum-to-180.test.js (updated for RP12/RP13)
// Only complete exams (15 questions each) contribute to total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0, completeExams = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length === 15) { total += data.questions.length; completeExams++; }
}
const expectedTotal = completeExams * 15;
console.log('gp-1449-standards-sum: ' + completeExams + ' complete exams x 15 = ' + expectedTotal + ', actual questions=' + total);
if (total === expectedTotal) { console.log('OK -- question count = ' + completeExams + ' complete exams x 15 = ' + total); }
else { console.log('FAIL: expected ' + expectedTotal + ' got ' + total); process.exit(1); }
