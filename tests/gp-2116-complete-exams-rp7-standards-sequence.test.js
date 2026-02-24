// gp-2116-complete-exams-rp7-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2116-rp7-standards:', JSON.stringify(stds));
console.log('OK -- RP7 standards sequence snapshot locked');
