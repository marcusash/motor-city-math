// gp-1445-w3e-count-total.test.js
// W3.e total must be 6 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W3.e').length;
}
console.log('gp-1445-w3e-total: W3.e appears ' + total + ' times');
if (total === 6) { console.log('OK -- W3.e total locked at 6'); }
else { console.log('FAIL: expected 6, got ' + total); process.exit(1); }
