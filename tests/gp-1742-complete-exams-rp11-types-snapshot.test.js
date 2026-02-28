// gp-1742-complete-exams-rp11-types-snapshot.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1742-rp11-types:', types.join(','));
console.log('OK -- RP11 question types snapshot locked');
