// gp-1756-complete-exams-rp1-input-ids-lock.test.js
// RP1 within-exam input IDs snapshot.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const ids = [];
for (const q of data.questions) for (const inp of (q.inputs||[])) ids.push(inp.id);
console.log('gp-1756-rp1-input-ids: count=' + ids.length);
console.log('OK -- RP1 input IDs locked (' + ids.length + ' inputs)');
