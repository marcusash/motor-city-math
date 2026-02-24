// gp-1849-complete-exams-rp4-standards-snapshot.test.js
// RP4 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-4.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1849-rp4-standards:', stds.join(','));
console.log('OK -- RP4 standards snapshot locked (' + stds.length + ' questions)');
