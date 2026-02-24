// gp-1787-complete-exams-per-exam-rp6-input-count.test.js
// RP6 has exactly 30 inputs locked.
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
console.log('gp-1787-rp6-inputs:', n);
if (n !== 30) { console.log('FAIL: expected 30 got', n); process.exit(1); }
console.log('OK -- RP6 input count locked at 30');
