// gp-1885-complete-exams-total-number-inputs-294-lock.test.js
// Total number inputs across 12 complete exams = 294.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) total += (q.inputs||[]).filter(i=>i.type==='number').length;
}
console.log('gp-1885-total-number-inputs:', total);
if (total !== 294) { console.log('FAIL: expected 294 got', total); process.exit(1); }
console.log('OK -- 294 total number inputs across 12 complete exams');
