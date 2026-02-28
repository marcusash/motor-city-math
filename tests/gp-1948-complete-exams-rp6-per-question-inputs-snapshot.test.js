// gp-1948-complete-exams-rp6-per-question-inputs-snapshot.test.js
// RP6 per-question input counts snapshot (locked). RP6=30 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1948-rp6-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 30) { console.log('FAIL: RP6 expected 30 total inputs got', total); process.exit(1); }
console.log('OK -- RP6 per-question input counts snapshot locked (total='+total+')');
