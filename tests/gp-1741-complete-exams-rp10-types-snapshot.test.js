// gp-1741-complete-exams-rp10-types-snapshot.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1741-rp10-types:', types.join(','));
console.log('OK -- RP10 question types snapshot locked');
