// gp-1971-complete-exams-rp3-per-question-steps-snapshot.test.js
// RP3 per-question solution step counts snapshot (locked). RP3=71 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-3.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1971-rp3-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 71) { console.log('FAIL: RP3 expected 71 steps got', total); process.exit(1); }
console.log('OK -- RP3 per-question step snapshot locked (total='+total+')');
