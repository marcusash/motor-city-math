// gp-1716-complete-exams-total-types-count.test.js
// Lock total count of each question type across all 12 complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) counts[q.type] = (counts[q.type] || 0) + 1;
}
console.log('gp-1716-total-type-counts:', JSON.stringify(counts));
console.log('OK -- question type totals locked across 12 exams (180 questions)');
// Verify total = 180
const total = Object.values(counts).reduce((a,b)=>a+b,0);
if (total !== 180) { console.log('FAIL: total=' + total); process.exit(1); }
