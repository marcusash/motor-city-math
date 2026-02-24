// gp-1874-complete-exams-solution-steps-total-lock.test.js
// Grand total of solution steps across 12 complete exams = 822.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  total += data.questions.reduce((s,q)=>s+(q.solution_steps||[]).length,0);
}
console.log('gp-1874-total-steps:', total);
if (total !== 822) { console.log('FAIL: expected 822 got', total); process.exit(1); }
console.log('OK -- total solution steps locked at 822 across 12 exams');
