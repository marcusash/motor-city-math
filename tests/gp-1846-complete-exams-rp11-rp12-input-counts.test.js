// gp-1846-complete-exams-rp11-rp12-input-counts.test.js
// RP11=42, RP12=29 input counts locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {'retake-practice-11.json':42,'retake-practice-12.json':29};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
  if (n === expected) console.log('OK:', file.replace('.json',''), n, 'inputs');
  else { console.log('FAIL:', file.replace('.json',''), 'expected', expected, 'got', n); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP11/RP12 input counts locked (42/29)');
