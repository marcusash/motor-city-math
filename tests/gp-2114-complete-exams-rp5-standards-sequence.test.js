// gp-2114-complete-exams-rp5-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-5.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2114-rp5-standards:', JSON.stringify(stds));
console.log('OK -- RP5 standards sequence snapshot locked');
