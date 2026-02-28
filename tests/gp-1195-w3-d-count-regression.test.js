// gp-1195-w3-d-count-regression.test.js
// W3.d must appear 28 times across all exams (baseline lock).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let count = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === 'W3.d').length;
}
const EXPECTED = 28;
console.log('gp-1195-w3-d-count: ' + count + ' (expected ' + EXPECTED + ')');
if (count !== EXPECTED) { console.log('  FAIL'); process.exit(1); }
console.log('OK -- W3.d count locked at ' + EXPECTED);
