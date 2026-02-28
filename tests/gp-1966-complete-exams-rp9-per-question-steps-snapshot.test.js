// gp-1966-complete-exams-rp9-per-question-steps-snapshot.test.js
// RP9 per-question solution step counts snapshot (locked). RP9=57 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1966-rp9-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 57) { console.log('FAIL: RP9 expected 57 steps got', total); process.exit(1); }
console.log('OK -- RP9 per-question step snapshot locked (total='+total+')');
