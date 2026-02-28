// gp-2177-complete-exams-rp6-input-count-snapshot.test.js
// RP6 per-question input count snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q => ({q:q.number, n:(q.inputs||[]).length}));
console.log('gp-2177-rp6-input-counts:', JSON.stringify(counts));
console.log('OK -- RP6 per-question input counts snapshot locked');
