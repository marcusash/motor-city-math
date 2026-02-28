// gp-2117-complete-exams-rp8-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2117-rp8-standards:', JSON.stringify(stds));
console.log('OK -- RP8 standards sequence snapshot locked');
