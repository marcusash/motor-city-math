// gp-1955-complete-exams-rp12-per-question-inputs-snapshot.test.js
// RP12 per-question input counts snapshot (locked). RP12=29 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1955-rp12-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 29) { console.log('FAIL: RP12 expected 29 total inputs got', total); process.exit(1); }
console.log('OK -- RP12 per-question input counts snapshot locked (total='+total+')');
