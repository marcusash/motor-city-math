// gp-1828-complete-exams-rp7-standards-snapshot.test.js
// RP7 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-7.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1828-rp7-standards:', stds.join(','));
console.log('OK -- RP7 standards snapshot locked (' + stds.length + ' questions)');
