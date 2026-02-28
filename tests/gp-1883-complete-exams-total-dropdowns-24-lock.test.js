// gp-1883-complete-exams-total-dropdowns-24-lock.test.js
// Total dropdown inputs across 12 complete exams = 24.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) total += (q.inputs||[]).filter(i=>i.type==='dropdown').length;
}
console.log('gp-1883-total-dropdowns:', total);
if (total !== 24) { console.log('FAIL: expected 24 got', total); process.exit(1); }
console.log('OK -- 24 total dropdown inputs across 12 complete exams');
