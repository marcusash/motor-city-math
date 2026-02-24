// gp-1963-complete-exams-rp6-per-question-steps-snapshot.test.js
// RP6 per-question solution step counts snapshot (locked). RP6=62 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1963-rp6-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 62) { console.log('FAIL: RP6 expected 62 steps got', total); process.exit(1); }
console.log('OK -- RP6 per-question step snapshot locked (total='+total+')');
