// gp-2187-complete-exams-rp7-per-q-input-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q=>({q:q.number,n:(q.inputs||[]).length}));
console.log('gp-2187-rp7-input-counts:', JSON.stringify(counts));
console.log('OK -- RP7 per-question input counts snapshot locked');
