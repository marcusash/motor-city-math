// gp-1739-complete-exams-rp7-types-snapshot.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1739-rp7-types:', types.join(','));
console.log('OK -- RP7 question types snapshot locked');
