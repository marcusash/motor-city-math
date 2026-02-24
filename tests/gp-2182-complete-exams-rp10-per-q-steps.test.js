// gp-2182-complete-exams-rp10-per-q-step-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q=>({q:q.number,n:(q.solution_steps||[]).length}));
console.log('gp-2182-rp10-per-q-steps:', JSON.stringify(counts));
console.log('OK -- RP10 per-question step counts snapshot recorded');
