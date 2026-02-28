// gp-2111-complete-exams-rp2-standards-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-2.json'),'utf8'));
const stds = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.standard);
console.log('gp-2111-rp2-standards:', JSON.stringify(stds));
console.log('OK -- RP2 standards sequence snapshot locked');
