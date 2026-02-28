// gp-1196-w3-a-count-regression.test.js
// W3.a must appear 20 times across all exams (baseline lock).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let count = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === 'W3.a').length;
}
const EXPECTED = 20;
console.log('gp-1196-w3-a-count: ' + count + ' (expected ' + EXPECTED + ')');
if (count !== EXPECTED) { console.log('  FAIL'); process.exit(1); }
console.log('OK -- W3.a count locked at ' + EXPECTED);
