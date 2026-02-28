// gp-1803-complete-exams-per-exam-rp3-rp4-rp5-solution-steps.test.js
// RP3=71, RP4=71, RP5=89 solution steps locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-3.json':71,'retake-practice-4.json':71,'retake-practice-5.json':89};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.solution_steps||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'steps');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP3/RP4/RP5 solution step counts locked');
