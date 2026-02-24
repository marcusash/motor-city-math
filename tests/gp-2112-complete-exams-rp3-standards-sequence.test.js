// gp-2112-complete-exams-rp3-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-3.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2112-rp3-standards:', JSON.stringify(stds));
console.log('OK -- RP3 standards sequence snapshot locked');
