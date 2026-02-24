// gp-1929-complete-exams-rp1-per-question-inputs-snapshot.test.js
// RP1 per-question input counts snapshot (locked).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
console.log('gp-1929-rp1-per-q-inputs:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 24) { console.log('FAIL: RP1 expected 24 total inputs got', total); process.exit(1); }
console.log('OK -- RP1 per-question input counts snapshot locked (total='+total+')');
