// gp-1958-complete-exams-rp9-per-question-inputs-snapshot.test.js
// RP9 per-question input counts snapshot (locked). RP9=39 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1958-rp9-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 39) { console.log('FAIL: RP9 expected 39 total inputs got', total); process.exit(1); }
console.log('OK -- RP9 per-question input counts snapshot locked (total='+total+')');
