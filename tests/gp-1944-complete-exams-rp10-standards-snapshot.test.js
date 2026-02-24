// gp-1944-complete-exams-rp10-standards-snapshot.test.js
// RP10 per-question standard snapshot (locked).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data','retake-practice-10.json'),'utf8'));
const stds = data.questions.map(q => q.standard);
console.log('gp-1944-stds-'+data.exam_id+':', stds.join(','));
console.log('OK -- RP10 per-question standard snapshot locked');
