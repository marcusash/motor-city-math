// gp-1833-complete-exams-rp4-rp5-input-counts-lock.test.js
// RP4=28, RP5=28 input counts locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-4.json':28,'retake-practice-5.json':28};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'inputs');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP4/RP5 input counts locked at 28 each');
