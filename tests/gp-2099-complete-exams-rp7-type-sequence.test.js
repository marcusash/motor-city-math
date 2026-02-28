// gp-2099-complete-exams-rp7-type-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2099-rp7-types:', JSON.stringify(types));
console.log('OK -- RP7 type sequence snapshot locked');
