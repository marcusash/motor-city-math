// gp-1891-complete-exams-rp1-rp2-rp3-input-counts.test.js
// RP1=24, RP2=24, RP3=25 input counts locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-1.json':24,'retake-practice-2.json':24,'retake-practice-3.json':25};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'inputs');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP1/RP2/RP3 input counts locked (24/24/25)');
