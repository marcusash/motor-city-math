// gp-1788-complete-exams-per-exam-rp11-input-count.test.js
// RP11 has exactly 42 inputs locked.
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
console.log('gp-1788-rp11-inputs:', n);
if (n !== 42) { console.log('FAIL: expected 42 got', n); process.exit(1); }
console.log('OK -- RP11 input count locked at 42');
