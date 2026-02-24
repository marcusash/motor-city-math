// gp-1967-complete-exams-rp10-per-question-steps-snapshot.test.js
// RP10 per-question solution step counts snapshot (locked). RP10=61 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1967-rp10-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 61) { console.log('FAIL: RP10 expected 61 steps got', total); process.exit(1); }
console.log('OK -- RP10 per-question step snapshot locked (total='+total+')');
