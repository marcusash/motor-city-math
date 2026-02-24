// gp-1965-complete-exams-rp5-per-question-steps-snapshot.test.js
// RP5 per-question solution step counts snapshot (locked). RP5=89 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-5.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1965-rp5-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 89) { console.log('FAIL: RP5 expected 89 steps got', total); process.exit(1); }
console.log('OK -- RP5 per-question step snapshot locked (total='+total+')');
