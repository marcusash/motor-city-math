// gp-1508-rp12-q4-exponential.test.js
// RP12 Q4 (index 3) must be 'exponential' (consistent with all other exams).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const q4 = data.questions[3];
console.log('gp-1508-rp12-q4: type=' + (q4 && q4.type));
if (q4 && q4.type === 'exponential') { console.log('OK -- RP12 Q4 is exponential'); }
else { console.log('FAIL: expected exponential, got ' + (q4 && q4.type)); process.exit(1); }
