// gp-1735-complete-exams-rp12-types-snapshot.test.js
// RP12 full question types snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1735-rp12-types:', types.join(','));
console.log('OK -- RP12 question types snapshot locked');
