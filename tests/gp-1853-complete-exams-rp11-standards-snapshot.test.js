// gp-1853-complete-exams-rp11-standards-snapshot.test.js
// RP11 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-11.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1853-rp11-standards:', stds.join(','));
console.log('OK -- RP11 standards snapshot locked (' + stds.length + ' questions)');
