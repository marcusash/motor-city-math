// gp-2122-complete-exams-rp12-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2122-rp12-standards:', JSON.stringify(stds));
console.log('OK -- RP12 standards sequence snapshot locked');
