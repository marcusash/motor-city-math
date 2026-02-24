// gp-1921-complete-exams-w3-questions-114-lock.test.js
// Total W3 standards questions across 12 complete exams = 114.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  total += data.questions.filter(q => (q.standard||'').startsWith('W3')).length;
}
console.log('gp-1921-w3-total:', total);
if (total !== 114) { console.log('FAIL: expected 114 got', total); process.exit(1); }
console.log('OK -- 114 total W3 standard questions locked across 12 exams');
