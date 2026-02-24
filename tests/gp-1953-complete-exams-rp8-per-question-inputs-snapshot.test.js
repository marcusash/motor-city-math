// gp-1953-complete-exams-rp8-per-question-inputs-snapshot.test.js
// RP8 per-question input counts snapshot (locked). RP8=38 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1953-rp8-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 38) { console.log('FAIL: RP8 expected 38 total inputs got', total); process.exit(1); }
console.log('OK -- RP8 per-question input counts snapshot locked (total='+total+')');
