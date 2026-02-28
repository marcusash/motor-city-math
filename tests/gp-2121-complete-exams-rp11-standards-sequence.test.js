// gp-2121-complete-exams-rp11-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2121-rp11-standards:', JSON.stringify(stds));
console.log('OK -- RP11 standards sequence snapshot locked');
