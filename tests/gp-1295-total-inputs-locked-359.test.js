// gp-1295-total-inputs-locked-359.test.js
// Grand total of all inputs across all exams must equal 359.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) total += (q.inputs || []).length;
}
const EXPECTED = 359;
console.log('gp-1295-total-inputs: ' + total + ' (expected ' + EXPECTED + ')');
if (total !== EXPECTED) { console.log('  FAIL: expected', EXPECTED, 'got', total); process.exit(1); }
console.log('OK -- total inputs locked at ' + EXPECTED + ' (272 number + 61 text + 21 dropdown + 5 radio)');
