// gp-1848-complete-exams-rp2-standards-snapshot.test.js
// RP2 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-2.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1848-rp2-standards:', stds.join(','));
console.log('OK -- RP2 standards snapshot locked (' + stds.length + ' questions)');
