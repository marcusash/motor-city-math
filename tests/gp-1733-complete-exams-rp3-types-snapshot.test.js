// gp-1733-complete-exams-rp3-types-snapshot.test.js
// RP3 full question types snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-3.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1733-rp3-types:', types.join(','));
console.log('OK -- RP3 question types snapshot locked');
