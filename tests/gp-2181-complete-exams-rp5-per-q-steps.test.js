// gp-2181-complete-exams-rp5-per-q-step-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-5.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q=>({q:q.number,n:(q.solution_steps||[]).length}));
console.log('gp-2181-rp5-per-q-steps:', JSON.stringify(counts));
console.log('OK -- RP5 per-question step counts snapshot recorded');
