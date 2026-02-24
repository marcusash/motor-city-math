// gp-1317-w3c-standard-count-locked.test.js
// W3.c standard must appear exactly 16 times.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let count = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === 'W3.c').length;
}
const EXPECTED = 16;
console.log('gp-1317-w3c-count: ' + count + ' (expected ' + EXPECTED + ')');
if (count !== EXPECTED) { console.log('  FAIL: expected', EXPECTED, 'got', count); process.exit(1); }
console.log('OK -- W3.c count locked at ' + EXPECTED);
