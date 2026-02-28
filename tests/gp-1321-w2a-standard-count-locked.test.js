// gp-1321-w2a-standard-count-locked.test.js
// W2.a standard must appear exactly 8 times.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let count = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === 'W2.a').length;
}
const EXPECTED = 8;
console.log('gp-1321-w2a-count: ' + count + ' (expected ' + EXPECTED + ')');
if (count !== EXPECTED) { console.log('  FAIL: expected', EXPECTED, 'got', count); process.exit(1); }
console.log('OK -- W2.a count locked at ' + EXPECTED);
