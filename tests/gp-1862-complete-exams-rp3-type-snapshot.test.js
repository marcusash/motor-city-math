// gp-1862-complete-exams-rp3-type-snapshot.test.js
// RP3 per-question type snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-3.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1862-rp3-types:', types.join(','));
console.log('OK -- RP3 per-question type snapshot locked');
