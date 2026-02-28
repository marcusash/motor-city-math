// gp-1761-complete-exams-total-inputs-all-types-add-up.test.js
// 294 number + 63 text + 24 dropdown + 7 radio = 388 total. Lock all.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {number:0, text:0, dropdown:0, radio:0};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) for (const inp of (q.inputs||[])) counts[inp.type] = (counts[inp.type]||0)+1;
}
const EXPECTED = {number:294, text:63, dropdown:24, radio:7};
let fail = 0;
for (const [t,n] of Object.entries(EXPECTED)) {
  if ((counts[t]||0) !== n) { console.log('FAIL:', t, 'expected', n, 'got', counts[t]); fail++; }
}
console.log('gp-1761-input-type-totals:', JSON.stringify(counts));
if (fail > 0) process.exit(1);
console.log('OK -- all input type totals locked: 294 number, 63 text, 24 dropdown, 7 radio');
