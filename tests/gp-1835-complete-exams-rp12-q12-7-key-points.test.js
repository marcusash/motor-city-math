// gp-1835-complete-exams-rp12-q12-7-key-points.test.js
// RP12 Q12 has 7 key_points (unique among all exams -- all others have 5).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const q12 = data.questions.find(q => q.id === 'rp12-q12');
const kpCount = (q12 && q12.graph && q12.graph.key_points || []).length;
console.log('gp-1835-rp12-q12-key-points:', kpCount);
if (kpCount !== 7) { console.log('FAIL: expected 7 got', kpCount); process.exit(1); }
console.log('OK -- RP12 Q12 has 7 key_points (unique special case)');
