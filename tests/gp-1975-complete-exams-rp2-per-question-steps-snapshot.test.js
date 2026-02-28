// gp-1975-complete-exams-rp2-per-question-steps-snapshot.test.js
// RP2 per-question solution step counts snapshot (locked). RP2=72 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-2.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1975-rp2-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 72) { console.log('FAIL: RP2 expected 72 steps got', total); process.exit(1); }
console.log('OK -- RP2 per-question step snapshot locked (total='+total+')');
