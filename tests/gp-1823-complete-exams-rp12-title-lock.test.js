// gp-1823-complete-exams-rp12-title-lock.test.js
// RP12 has a special title 'Unit 2 Final Paper Exam' (not 'Retake Practice').

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const EXPECTED = 'Unit 2 Final Paper Exam \u2014 Nonlinear Functions';
console.log('gp-1823-rp12-title:', JSON.stringify(data.title));
if (data.title !== EXPECTED) { console.log('FAIL: expected', JSON.stringify(EXPECTED)); process.exit(1); }
console.log('OK -- RP12 title locked as "' + EXPECTED + '"');
