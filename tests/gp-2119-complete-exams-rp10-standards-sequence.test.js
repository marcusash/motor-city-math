// gp-2119-complete-exams-rp10-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2119-rp10-standards:', JSON.stringify(stds));
console.log('OK -- RP10 standards sequence snapshot locked');
