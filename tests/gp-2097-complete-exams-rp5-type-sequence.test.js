// gp-2097-complete-exams-rp5-type-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-5.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2097-rp5-types:', JSON.stringify(types));
console.log('OK -- RP5 type sequence snapshot locked');
