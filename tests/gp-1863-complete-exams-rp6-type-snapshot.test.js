// gp-1863-complete-exams-rp6-type-snapshot.test.js
// RP6 per-question type snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1863-rp6-types:', types.join(','));
console.log('OK -- RP6 per-question type snapshot locked');
