// gp-1786-complete-exams-per-exam-rp1-input-count.test.js
// RP1 has exactly 24 inputs locked.
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const n = data.questions.reduce((s,q)=>s+(q.inputs||[]).length,0);
console.log('gp-1786-rp1-inputs:', n);
if (n !== 24) { console.log('FAIL: expected 24 got', n); process.exit(1); }
console.log('OK -- RP1 input count locked at 24');
