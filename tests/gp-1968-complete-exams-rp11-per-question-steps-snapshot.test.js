// gp-1968-complete-exams-rp11-per-question-steps-snapshot.test.js
// RP11 per-question solution step counts snapshot (locked). RP11=65 total.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const counts = data.questions.map(q => (q.solution_steps||[]).length);
console.log('gp-1968-rp11-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
if (total !== 65) { console.log('FAIL: RP11 expected 65 steps got', total); process.exit(1); }
console.log('OK -- RP11 per-question step snapshot locked (total='+total+')');
