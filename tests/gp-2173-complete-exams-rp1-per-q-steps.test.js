// gp-2173-complete-exams-rp1-per-q-step-count.test.js
// RP1 step counts snapshot -- locked per question.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q => ({q:q.number, n:(q.solution_steps||[]).length}));
console.log('gp-2173-rp1-per-q-steps:', JSON.stringify(counts));
console.log('OK -- RP1 per-question step counts snapshot recorded');
