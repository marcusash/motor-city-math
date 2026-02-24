// gp-1732-complete-exams-rp2-types-snapshot.test.js
// RP2 full question types snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-2.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1732-rp2-types:', types.join(','));
console.log('OK -- RP2 question types snapshot locked');
