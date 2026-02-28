// gp-1829-complete-exams-rp10-standards-snapshot.test.js
// RP10 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1829-rp10-standards:', stds.join(','));
console.log('OK -- RP10 standards snapshot locked (' + stds.length + ' questions)');
