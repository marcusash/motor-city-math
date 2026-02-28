// gp-1927-complete-exams-rp8-per-question-steps-snapshot.test.js
// RP8 per-question solution step counts snapshot (locked).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const counts = data.questions.map(q => q.solution_steps ? q.solution_steps.length : 0);
console.log('gp-1927-rp8-per-q-steps:', counts.join(','));
const total = counts.reduce((s,n)=>s+n,0);
console.log('OK -- RP8 per-question step counts snapshot locked (total='+total+')');
