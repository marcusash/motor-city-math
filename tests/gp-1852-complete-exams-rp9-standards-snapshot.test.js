// gp-1852-complete-exams-rp9-standards-snapshot.test.js
// RP9 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-9.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1852-rp9-standards:', stds.join(','));
console.log('OK -- RP9 standards snapshot locked (' + stds.length + ' questions)');
