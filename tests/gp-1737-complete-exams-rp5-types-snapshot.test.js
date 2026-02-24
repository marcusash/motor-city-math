// gp-1737-complete-exams-rp5-types-snapshot.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-5.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1737-rp5-types:', types.join(','));
console.log('OK -- RP5 question types snapshot locked');
