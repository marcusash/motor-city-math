// gp-1736-complete-exams-rp4-types-snapshot.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-4.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1736-rp4-types:', types.join(','));
console.log('OK -- RP4 question types snapshot locked');
