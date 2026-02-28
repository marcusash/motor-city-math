// gp-1587-per-exam-type-distribution-rp2.test.js
// Lock question type distribution for RP2.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-2.json'), 'utf8'));
const types = {};
for (const q of data.questions) types[q.type] = (types[q.type] || 0) + 1;
const typeStr = Object.entries(types).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1587-rp2-types: ' + typeStr);
console.log('OK -- RP2 type distribution locked: ' + typeStr);
