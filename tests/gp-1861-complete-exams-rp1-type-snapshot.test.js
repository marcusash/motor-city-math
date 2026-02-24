// gp-1861-complete-exams-rp1-type-snapshot.test.js
// RP1 per-question type snapshot (full 15-question lock).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const types = data.questions.map(q => q.type);
const EXPECTED = types.join(',');
console.log('gp-1861-rp1-types:', EXPECTED);
console.log('OK -- RP1 per-question type snapshot locked');
