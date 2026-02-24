// gp-1510-rp12-q15-word-problem.test.js
// RP12 Q15 (index 14) must be 'word-problem' (consistent with all other exams).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const q15 = data.questions[14];
console.log('gp-1510-rp12-q15: type=' + (q15 && q15.type));
if (q15 && q15.type === 'word-problem') { console.log('OK -- RP12 Q15 is word-problem'); }
else { console.log('FAIL: expected word-problem, got ' + (q15 && q15.type)); process.exit(1); }
