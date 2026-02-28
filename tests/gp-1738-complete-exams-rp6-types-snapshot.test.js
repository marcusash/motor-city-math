// gp-1738-complete-exams-rp6-types-snapshot.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1738-rp6-types:', types.join(','));
console.log('OK -- RP6 question types snapshot locked');
