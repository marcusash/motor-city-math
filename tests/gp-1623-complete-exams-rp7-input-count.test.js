// gp-1623-complete-exams-rp7-input-count.test.js
// Lock RP7 total input count = 41.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-7.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1623-rp7-input-count: ' + total);
if (total !== 41) { console.log('FAIL: expected 41, got ' + total); process.exit(1); }
console.log('OK -- RP7 total inputs = 41');
