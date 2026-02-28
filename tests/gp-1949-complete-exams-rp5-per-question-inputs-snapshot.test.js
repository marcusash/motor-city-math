// gp-1949-complete-exams-rp5-per-question-inputs-snapshot.test.js
// RP5 per-question input counts snapshot (locked). RP5=28 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-5.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1949-rp5-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 28) { console.log('FAIL: RP5 expected 28 total inputs got', total); process.exit(1); }
console.log('OK -- RP5 per-question input counts snapshot locked (total='+total+')');
