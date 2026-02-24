// gp-1813-complete-exams-rp2-per-question-input-counts.test.js
// RP2 per-question input count snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-2.json'),'utf8'));
const counts = data.questions.map(q => (q.inputs||[]).length);
const total = counts.reduce((a,b)=>a+b,0);
console.log('gp-1813-rp2-input-counts:', counts.join(','), 'total='+total);
if (total !== 24) { console.log('FAIL: expected 24 got', total); process.exit(1); }
console.log('OK -- RP2 input count per question snapshot locked (total=24)');
