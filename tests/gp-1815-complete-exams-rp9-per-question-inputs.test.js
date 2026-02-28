// gp-1815-complete-exams-rp9-per-question-input-counts.test.js
// RP9 per-question input count snapshot (39 total).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
const total = counts.reduce((a,b)=>a+b,0);
console.log('gp-1815-rp9-input-counts:', counts.join(','), 'total='+total);
if (total !== 39) { console.log('FAIL: expected 39 got', total); process.exit(1); }
console.log('OK -- RP9 input count snapshot locked (total=39)');
