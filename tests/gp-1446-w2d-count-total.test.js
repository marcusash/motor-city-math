// gp-1446-w2d-count-total.test.js
// W2.d total must be 5 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W2.d').length;
}
console.log('gp-1446-w2d-total: W2.d appears ' + total + ' times');
if (total === 5) { console.log('OK -- W2.d total locked at 5'); }
else { console.log('FAIL: expected 5, got ' + total); process.exit(1); }
