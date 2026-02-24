// gp-1626-complete-exams-rp8-q1-quadratic.test.js
// RP8 Q1 must be type=quadratic (newer exam schema, RP8-12 pattern).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-8.json'), 'utf8'));
const q1 = data.questions[0];
console.log('gp-1626-rp8-q1-type: type=' + q1.type + ' standard=' + q1.standard);
if (q1.type !== 'quadratic') { console.log('FAIL: expected quadratic, got ' + q1.type); process.exit(1); }
console.log('OK -- RP8 Q1 type=quadratic confirmed');
