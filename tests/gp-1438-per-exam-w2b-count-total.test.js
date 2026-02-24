// gp-1438-per-exam-w2b-count-total.test.js
// W2.b total must be 26 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W2.b').length;
}
console.log('gp-1438-w2b-total: W2.b appears ' + total + ' times');
if (total === 26) {
  console.log('OK -- W2.b total locked at 26');
} else {
  console.log('FAIL: expected 26, got ' + total);
  process.exit(1);
}
