// gp-1882-complete-exams-total-graphs-24-lock.test.js
// Total graph objects across 12 complete exams = 24.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  total += data.questions.filter(q => q.graph).length;
}
console.log('gp-1882-total-graphs:', total);
if (total !== 24) { console.log('FAIL: expected 24 got', total); process.exit(1); }
console.log('OK -- 24 total graph objects across 12 complete exams');
