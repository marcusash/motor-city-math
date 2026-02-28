// gp-1893-complete-exams-rp9-rp12-input-counts.test.js
// RP9=39, RP12=29 input counts locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-9.json':39,'retake-practice-12.json':29};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'inputs');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP9/RP12 input counts locked (39/29)');
