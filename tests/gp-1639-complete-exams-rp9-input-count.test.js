// gp-1639-complete-exams-rp9-input-count.test.js
// Lock RP9 total input count = 39.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-9.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.inputs || []).length;
console.log('gp-1639-rp9-input-count: ' + total);
if (total !== 39) { console.log('FAIL: expected 39, got ' + total); process.exit(1); }
console.log('OK -- RP9 total inputs = 39');
