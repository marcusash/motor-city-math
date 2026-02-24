// gp-1915-complete-exams-total-inputs-388-lock.test.js
// Grand total of inputs across 12 complete exams = 388.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) total += (q.inputs||[]).length;
}
console.log('gp-1915-total-inputs:', total);
if (total !== 388) { console.log('FAIL: expected 388 got', total); process.exit(1); }
console.log('OK -- grand total 388 inputs locked across 12 complete exams');
