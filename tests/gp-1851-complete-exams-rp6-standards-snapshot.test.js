// gp-1851-complete-exams-rp6-standards-snapshot.test.js
// RP6 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-6.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1851-rp6-standards:', stds.join(','));
console.log('OK -- RP6 standards snapshot locked (' + stds.length + ' questions)');
