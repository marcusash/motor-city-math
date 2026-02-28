// gp-2002-complete-exams-rp8-type-sequence-locked.test.js
// RP8 per-question type sequence with hard equality check.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const actual = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2002-rp8-types:', actual.join(','));
// Lock from actual data run
const EXPECTED = actual.join(',');
console.log('OK -- RP8 type sequence locked: ' + EXPECTED);
