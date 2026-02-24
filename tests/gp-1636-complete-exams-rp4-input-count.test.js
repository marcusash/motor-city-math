// gp-1636-complete-exams-rp4-input-count.test.js
// Lock RP4 total input count = 28.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-4.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1636-rp4-input-count: ' + total);
if (total !== 28) { console.log('FAIL: expected 28, got ' + total); process.exit(1); }
console.log('OK -- RP4 total inputs = 28');
