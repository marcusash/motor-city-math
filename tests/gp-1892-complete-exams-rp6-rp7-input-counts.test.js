// gp-1892-complete-exams-rp6-rp7-input-counts.test.js
// RP6=30, RP7=41 input counts locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-6.json':30,'retake-practice-7.json':41};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'inputs');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP6/RP7 input counts locked (30/41)');
