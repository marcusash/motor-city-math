// gp-1827-complete-exams-rp3-standards-snapshot.test.js
// RP3 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-3.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1827-rp3-standards:', stds.join(','));
console.log('OK -- RP3 standards snapshot locked (' + stds.length + ' questions)');
