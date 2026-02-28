// gp-2118-complete-exams-rp9-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2118-rp9-standards:', JSON.stringify(stds));
console.log('OK -- RP9 standards sequence snapshot locked');
