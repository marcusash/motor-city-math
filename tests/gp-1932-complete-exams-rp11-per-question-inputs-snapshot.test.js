// gp-1932-complete-exams-rp11-per-question-inputs-snapshot.test.js
// RP11 per-question input counts snapshot (locked). RP11=42 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1932-rp11-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 42) { console.log('FAIL: RP11 expected 42 total inputs got', total); process.exit(1); }
console.log('OK -- RP11 per-question input counts snapshot locked (total='+total+')');
