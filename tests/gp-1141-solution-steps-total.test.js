// gp-1141-solution-steps-total.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.reduce((sum, q) => sum + (q.solution_steps || []).length, 0);
}
const EXPECTED = 748;
console.log('gp-1141-solution-steps-total: ' + total + ' (expected ' + EXPECTED + ')');
if (total !== EXPECTED) { console.log('  FAIL: mismatch'); process.exit(1); }
console.log('OK -- total solution steps locked at ' + EXPECTED);
