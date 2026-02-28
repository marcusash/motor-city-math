// gp-1641-complete-exams-rp10-input-count.test.js
// Lock RP10 total input count = 40.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-10.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1641-rp10-input-count: ' + total);
if (total !== 40) { console.log('FAIL: expected 40, got ' + total); process.exit(1); }
console.log('OK -- RP10 total inputs = 40');
