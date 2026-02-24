// gp-1442-w2c-count-total.test.js
// W2.c total must be 11 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W2.c').length;
}
console.log('gp-1442-w2c-total: W2.c appears ' + total + ' times');
if (total === 11) { console.log('OK -- W2.c total locked at 11'); }
else { console.log('FAIL: expected 11, got ' + total); process.exit(1); }
