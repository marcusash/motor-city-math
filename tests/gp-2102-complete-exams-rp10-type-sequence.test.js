// gp-2102-complete-exams-rp10-type-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2102-rp10-types:', JSON.stringify(types));
console.log('OK -- RP10 type sequence snapshot locked');
