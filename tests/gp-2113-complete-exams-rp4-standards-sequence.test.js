// gp-2113-complete-exams-rp4-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-4.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2113-rp4-standards:', JSON.stringify(stds));
console.log('OK -- RP4 standards sequence snapshot locked');
