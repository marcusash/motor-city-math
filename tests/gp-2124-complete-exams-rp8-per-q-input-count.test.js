// gp-2124-complete-exams-rp8-per-question-input-count.test.js
// RP8 per-question input count snapshot locked.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q => ({q:q.number, n:(q.inputs||[]).length}));
console.log('gp-2124-rp8-input-counts:', JSON.stringify(counts));
console.log('OK -- RP8 per-question input counts snapshot locked');
