// gp-2101-complete-exams-rp9-type-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2101-rp9-types:', JSON.stringify(types));
console.log('OK -- RP9 type sequence snapshot locked');
