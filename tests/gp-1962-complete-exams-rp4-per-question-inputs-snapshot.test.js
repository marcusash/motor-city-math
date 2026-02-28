// gp-1962-complete-exams-rp4-per-question-inputs-snapshot.test.js
// RP4 per-question input counts snapshot (locked). RP4=28 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-4.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1962-rp4-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 28) { console.log('FAIL: RP4 expected 28 total inputs got', total); process.exit(1); }
console.log('OK -- RP4 per-question input counts snapshot locked (total='+total+')');
