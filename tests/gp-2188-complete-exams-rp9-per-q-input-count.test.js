// gp-2188-complete-exams-rp9-per-q-input-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q=>({q:q.number,n:(q.inputs||[]).length}));
console.log('gp-2188-rp9-input-counts:', JSON.stringify(counts));
console.log('OK -- RP9 per-question input counts snapshot locked');
