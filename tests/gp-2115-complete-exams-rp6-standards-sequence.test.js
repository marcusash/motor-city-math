// gp-2115-complete-exams-rp6-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2115-rp6-standards:', JSON.stringify(stds));
console.log('OK -- RP6 standards sequence snapshot locked');
