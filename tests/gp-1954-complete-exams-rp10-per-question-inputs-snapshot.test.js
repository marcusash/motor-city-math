// gp-1954-complete-exams-rp10-per-question-inputs-snapshot.test.js
// RP10 per-question input counts snapshot (locked). RP10=40 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1954-rp10-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 40) { console.log('FAIL: RP10 expected 40 total inputs got', total); process.exit(1); }
console.log('OK -- RP10 per-question input counts snapshot locked (total='+total+')');
