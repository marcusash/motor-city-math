// gp-1888-complete-exams-rp6-rp7-steps-lock.test.js
// RP6=62, RP7=70 solution steps locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-6.json':62,'retake-practice-7.json':70};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.solution_steps||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'steps');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP6/RP7 solution step counts locked (62/70)');
