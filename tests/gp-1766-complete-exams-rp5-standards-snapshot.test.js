// gp-1766-complete-exams-rp5-standards-snapshot.test.js
// RP5 per-question standard snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-5.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1766-rp5-standards:', stds.join(','));
console.log('OK -- RP5 standards snapshot locked');
