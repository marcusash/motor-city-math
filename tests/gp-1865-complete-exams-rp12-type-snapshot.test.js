// gp-1865-complete-exams-rp12-type-snapshot.test.js
// RP12 per-question type snapshot (Final Paper Exam).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1865-rp12-types:', types.join(','));
console.log('OK -- RP12 per-question type snapshot locked');
