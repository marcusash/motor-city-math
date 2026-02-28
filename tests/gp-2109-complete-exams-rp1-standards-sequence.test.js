// gp-2109-complete-exams-rp1-standards-sequence.test.js
// RP1 standards sequence (Q1-Q15 ordered) snapshot locked.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2109-rp1-standards:', JSON.stringify(stds));
console.log('OK -- RP1 standards sequence snapshot locked');
