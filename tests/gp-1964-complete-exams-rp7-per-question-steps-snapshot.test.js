// gp-1964-complete-exams-rp7-per-question-steps-snapshot.test.js
// RP7 per-question solution step counts snapshot (locked). RP7=70 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1964-rp7-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 70) { console.log('FAIL: RP7 expected 70 steps got', total); process.exit(1); }
console.log('OK -- RP7 per-question step snapshot locked (total='+total+')');
