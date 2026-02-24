// gp-1449-all-standards-sum-to-180.test.js (updated for RP12)
// The total questions across all exams must be 15 * number of exams.
// RP12 added 15 questions. Standards breakdown now includes RP12 contribution.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const expectedPerExam = 15;
const expectedTotal = expectedPerExam * RP_FILES.length;
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.length;
}
console.log('gp-1449-standards-sum: ' + RP_FILES.length + ' exams x 15 = ' + expectedTotal + ', actual questions=' + total);
if (total === expectedTotal) { console.log('OK -- question count = ' + RP_FILES.length + ' exams x 15 = ' + total); }
else { console.log('FAIL: expected ' + expectedTotal + ' got ' + total); process.exit(1); }
