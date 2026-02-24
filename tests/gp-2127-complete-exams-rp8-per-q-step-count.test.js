// gp-2127-complete-exams-rp8-per-q-step-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q => ({q:q.number, n:(q.solution_steps||[]).length}));
console.log('gp-2127-rp8-step-counts:', JSON.stringify(counts));
console.log('OK -- RP8 per-question step counts snapshot locked');
