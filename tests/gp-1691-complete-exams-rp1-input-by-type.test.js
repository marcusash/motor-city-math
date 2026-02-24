// gp-1691-complete-exams-rp1-input-count-by-type.test.js
// Lock RP1 input count by type.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-1.json'), 'utf8'));
const counts = {number:0, text:0, dropdown:0, radio:0};
for (const q of data.questions) for (const inp of (q.inputs||[])) counts[inp.type] = (counts[inp.type]||0)+1;
console.log('gp-1691-rp1-inputs:', JSON.stringify(counts));
// Lock: RP1 inputs snapshot
const EXPECTED = {number:20, text:0, dropdown:3, radio:1};
let pass = true;
for (const [t,n] of Object.entries(EXPECTED)) if ((counts[t]||0) !== n) { console.log('FAIL:', t, 'expected', n, 'got', counts[t]); pass=false; }
if (!pass) process.exit(1);
console.log('OK -- RP1 input type breakdown locked');
