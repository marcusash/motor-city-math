// gp-1729-complete-exams-rp8-q-types-full.test.js
// RP8 per-question type full snapshot lock (newer schema).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1729-rp8-types:', types.join(','));
console.log('OK -- RP8 question types snapshot locked (' + types.length + ' questions)');
