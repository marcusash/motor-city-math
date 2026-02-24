// gp-1621-complete-exams-rp1-input-count.test.js
// Lock RP1 total input count = 24.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-1.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1621-rp1-input-count: ' + total);
if (total !== 24) { console.log('FAIL: expected 24, got ' + total); process.exit(1); }
console.log('OK -- RP1 total inputs = 24');
