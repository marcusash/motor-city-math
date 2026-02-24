// gp-1509-rp12-q11-fractional-exp.test.js
// RP12 Q11 (index 10) must be 'fractional-exp' (consistent with all other exams).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const q11 = data.questions[10];
console.log('gp-1509-rp12-q11: type=' + (q11 && q11.type));
if (q11 && q11.type === 'fractional-exp') { console.log('OK -- RP12 Q11 is fractional-exp'); }
else { console.log('FAIL: expected fractional-exp, got ' + (q11 && q11.type)); process.exit(1); }
