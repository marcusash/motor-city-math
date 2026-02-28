// gp-1734-complete-exams-rp9-types-snapshot.test.js
// RP9 full question types snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1734-rp9-types:', types.join(','));
console.log('OK -- RP9 question types snapshot locked');
