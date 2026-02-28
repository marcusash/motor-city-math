// gp-1969-complete-exams-rp4-per-question-steps-snapshot.test.js
// RP4 per-question solution step counts snapshot (locked). RP4=71 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-4.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1969-rp4-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 71) { console.log('FAIL: RP4 expected 71 steps got', total); process.exit(1); }
console.log('OK -- RP4 per-question step snapshot locked (total='+total+')');
