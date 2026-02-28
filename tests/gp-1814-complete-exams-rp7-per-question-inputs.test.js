// gp-1814-complete-exams-rp7-per-question-input-counts.test.js
// RP7 per-question input count snapshot (41 total).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
const total = counts.reduce((a,b)=>a+b,0);
console.log('gp-1814-rp7-input-counts:', counts.join(','), 'total='+total);
if (total !== 41) { console.log('FAIL: expected 41 got', total); process.exit(1); }
console.log('OK -- RP7 input count snapshot locked (total=41)');
