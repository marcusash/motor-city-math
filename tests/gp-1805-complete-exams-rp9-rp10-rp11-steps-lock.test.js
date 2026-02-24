// gp-1805-complete-exams-per-exam-rp9-rp10-rp11-solution-steps.test.js
// RP9=57, RP10=61, RP11=65 solution steps locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-9.json':57,'retake-practice-10.json':61,'retake-practice-11.json':65};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.solution_steps||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'steps');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP9/RP10/RP11 solution step counts locked');
