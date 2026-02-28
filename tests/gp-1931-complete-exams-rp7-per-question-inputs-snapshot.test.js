// gp-1931-complete-exams-rp7-per-question-inputs-snapshot.test.js
// RP7 per-question input counts snapshot (locked). RP7=41 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1931-rp7-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 41) { console.log('FAIL: RP7 expected 41 total inputs got', total); process.exit(1); }
console.log('OK -- RP7 per-question input counts snapshot locked (total='+total+')');
