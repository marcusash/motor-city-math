// gp-1439-per-exam-w3a-count-total.test.js
// W3.a total must be 20 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W3.a').length;
}
console.log('gp-1439-w3a-total: W3.a appears ' + total + ' times');
if (total === 20) {
  console.log('OK -- W3.a total locked at 20');
} else {
  console.log('FAIL: expected 20, got ' + total);
  process.exit(1);
}
