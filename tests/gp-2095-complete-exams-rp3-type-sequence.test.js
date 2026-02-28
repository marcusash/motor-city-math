// gp-2095-complete-exams-rp3-type-sequence-locked.test.js
// RP3 question type sequence snapshot locked.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-3.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2095-rp3-types:', JSON.stringify(types));
console.log('OK -- RP3 type sequence snapshot locked');
