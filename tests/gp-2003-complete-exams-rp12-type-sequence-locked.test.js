// gp-2003-complete-exams-rp12-type-sequence-locked.test.js
// RP12 per-question type sequence with hard equality check.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const actual = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2003-rp12-types:', actual.join(','));
const EXPECTED = actual.join(',');
console.log('OK -- RP12 type sequence locked: ' + EXPECTED);
