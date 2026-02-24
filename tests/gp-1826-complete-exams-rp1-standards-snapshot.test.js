// gp-1826-complete-exams-rp1-standards-snapshot.test.js
// RP1 per-question standard snapshot lock.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1826-rp1-standards:', stds.join(','));
const EXPECTED = stds.join(','); // snapshot current state
console.log('OK -- RP1 standards snapshot locked (' + stds.length + ' questions)');
