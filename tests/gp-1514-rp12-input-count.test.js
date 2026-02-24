// gp-1514-rp12-input-count.test.js
// RP12 has 29 total inputs -- lock this baseline.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const total = data.questions.reduce((s, q) => s + (q.inputs || []).length, 0);
console.log('gp-1514-rp12-input-count: ' + total + ' inputs');
if (total === 29) { console.log('OK -- RP12 has 29 inputs locked'); }
else { console.log('FAIL: expected 29, got ' + total); process.exit(1); }
