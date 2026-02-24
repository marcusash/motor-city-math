// gp-1634-complete-exams-rp3-input-count.test.js
// Lock RP3 total input count = 25.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-3.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1634-rp3-input-count: ' + total);
if (total !== 25) { console.log('FAIL: expected 25, got ' + total); process.exit(1); }
console.log('OK -- RP3 total inputs = 25');
