// gp-1198-w2-c-count-regression.test.js
// W2.c must appear 11 times across all exams (baseline lock).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let count = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === 'W2.c').length;
}
const EXPECTED = 11;
console.log('gp-1198-w2-c-count: ' + count + ' (expected ' + EXPECTED + ')');
if (count !== EXPECTED) { console.log('  FAIL'); process.exit(1); }
console.log('OK -- W2.c count locked at ' + EXPECTED);
