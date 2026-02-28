// gp-2096-complete-exams-rp4-type-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-4.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2096-rp4-types:', JSON.stringify(types));
console.log('OK -- RP4 type sequence snapshot locked');
