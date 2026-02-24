// gp-1436-per-exam-w3b-count-monitor.test.js
// Monitor: W3.b standard appears ~3 times per exam on average (34 total / 11 exams ≈ 3.09).
// This is a soft monitor, not a hard lock.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.standard === 'W3.b').length;
  total += count;
}
console.log('gp-1436-w3b-total: W3.b appears ' + total + ' times across all exams');
if (total === 34) {
  console.log('OK -- W3.b total locked at 34');
} else {
  console.log('FAIL: W3.b total=' + total + ', expected 34');
  process.exit(1);
}
