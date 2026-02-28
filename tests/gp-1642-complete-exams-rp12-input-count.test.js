// gp-1642-complete-exams-rp12-input-count.test.js
// Lock RP12 total input count = 29.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1642-rp12-input-count: ' + total);
if (total !== 29) { console.log('FAIL: expected 29, got ' + total); process.exit(1); }
console.log('OK -- RP12 total inputs = 29');
