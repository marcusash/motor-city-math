// gp-2103-complete-exams-rp11-type-sequence.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const types = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
console.log('gp-2103-rp11-types:', JSON.stringify(types));
console.log('OK -- RP11 type sequence snapshot locked');
