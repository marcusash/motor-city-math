// gp-1922-complete-exams-w2-questions-66-lock.test.js
// Total W2 standards questions across 12 complete exams = 66.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  total += data.questions.filter(q => (q.standard||'').startsWith('W2')).length;
}
console.log('gp-1922-w2-total:', total);
if (total !== 66) { console.log('FAIL: expected 66 got', total); process.exit(1); }
console.log('OK -- 66 total W2 standard questions locked across 12 exams');
