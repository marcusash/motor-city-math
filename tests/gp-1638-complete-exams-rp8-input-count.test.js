// gp-1638-complete-exams-rp8-input-count.test.js
// Lock RP8 total input count = 38.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-8.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1638-rp8-input-count: ' + total);
if (total !== 38) { console.log('FAIL: expected 38, got ' + total); process.exit(1); }
console.log('OK -- RP8 total inputs = 38');
