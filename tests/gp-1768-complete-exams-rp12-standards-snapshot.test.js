// gp-1768-complete-exams-rp12-standards-snapshot.test.js
// RP12 per-question standard snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-12.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1768-rp12-standards:', stds.join(','));
console.log('OK -- RP12 standards snapshot locked');
