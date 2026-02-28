// gp-1444-w2a-count-total.test.js
// W2.a total must be 8 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W2.a').length;
}
console.log('gp-1444-w2a-total: W2.a appears ' + total + ' times');
if (total === 8) { console.log('OK -- W2.a total locked at 8'); }
else { console.log('FAIL: expected 8, got ' + total); process.exit(1); }
