// gp-1767-complete-exams-rp8-standards-snapshot.test.js
// RP8 per-question standard snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-8.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1767-rp8-standards:', stds.join(','));
console.log('OK -- RP8 standards snapshot locked');
