// gp-1169-total-inputs-regression.test.js
// Total inputs across all exams must stay at 359.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.reduce((sum, q) => sum + (q.inputs || []).length, 0);
}
const EXPECTED = 359;
console.log('gp-1169-total-inputs: ' + total + ' (expected ' + EXPECTED + ')');
if (total !== EXPECTED) { console.log('  FAIL: mismatch'); process.exit(1); }
console.log('OK -- total inputs locked at ' + EXPECTED);
