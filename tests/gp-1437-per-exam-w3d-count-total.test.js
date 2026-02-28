// gp-1437-per-exam-w3d-count-total.test.js
// W3.d total must be 28 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W3.d').length;
}
console.log('gp-1437-w3d-total: W3.d appears ' + total + ' times');
if (total === 28) {
  console.log('OK -- W3.d total locked at 28');
} else {
  console.log('FAIL: expected 28, got ' + total);
  process.exit(1);
}
