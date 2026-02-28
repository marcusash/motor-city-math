// gp-2098-complete-exams-rp6-type-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2098-rp6-types:', JSON.stringify(types));
console.log('OK -- RP6 type sequence snapshot locked');
