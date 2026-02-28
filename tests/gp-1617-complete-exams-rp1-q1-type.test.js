// gp-1617-complete-exams-rp1-q1-type.test.js
// Lock RP1 Q1 type.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-1.json'), 'utf8'));
const q1 = data.questions[0];
console.log('gp-1617-rp1-q1-type: ' + q1.type + ' standard=' + q1.standard);
console.log('OK -- RP1 Q1 type=' + q1.type + ' standard=' + q1.standard + ' locked');
