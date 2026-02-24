// gp-1635-complete-exams-rp6-input-count.test.js
// Lock RP6 total input count = 30.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-6.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1635-rp6-input-count: ' + total);
if (total !== 30) { console.log('FAIL: expected 30, got ' + total); process.exit(1); }
console.log('OK -- RP6 total inputs = 30');
