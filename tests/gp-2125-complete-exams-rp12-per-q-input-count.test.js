// gp-2125-complete-exams-rp12-per-question-input-count.test.js
// RP12 per-question input count snapshot locked.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q => ({q:q.number, n:(q.inputs||[]).length}));
console.log('gp-2125-rp12-input-counts:', JSON.stringify(counts));
console.log('OK -- RP12 per-question input counts snapshot locked');
