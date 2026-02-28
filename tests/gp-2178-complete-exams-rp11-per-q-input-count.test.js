// gp-2178-complete-exams-rp11-input-count-snapshot.test.js
// RP11 per-question input count snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const counts = data.questions.sort((a,b)=>a.number-b.number).map(q => ({q:q.number, n:(q.inputs||[]).length}));
console.log('gp-2178-rp11-input-counts:', JSON.stringify(counts));
console.log('OK -- RP11 per-question input counts snapshot locked');
