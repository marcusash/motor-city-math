// gp-1887-complete-exams-rp5-rp9-steps-lock.test.js
// RP5=89, RP9=57 solution steps locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-5.json':89,'retake-practice-9.json':57};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.solution_steps||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'steps');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP5/RP9 solution step counts locked (89/57)');
