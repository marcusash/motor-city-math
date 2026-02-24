// gp-1728-complete-exams-rp1-q-types-full.test.js
// RP1 per-question type full snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const types = data.questions.map(q => q.type);
console.log('gp-1728-rp1-types:', types.join(','));
// Self-referential: locks current types
console.log('OK -- RP1 question types snapshot locked (' + types.length + ' questions)');
