// gp-1624-complete-exams-rp11-input-count.test.js
// Lock RP11 total input count = 42.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-11.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1624-rp11-input-count: ' + total);
if (total !== 42) { console.log('FAIL: expected 42, got ' + total); process.exit(1); }
console.log('OK -- RP11 total inputs = 42');
