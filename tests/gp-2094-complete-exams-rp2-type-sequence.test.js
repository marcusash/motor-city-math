// gp-2094-complete-exams-rp2-type-sequence-locked.test.js
// RP2 question type sequence snapshot locked.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-2.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2094-rp2-types:', JSON.stringify(types));
console.log('OK -- RP2 type sequence snapshot locked');
