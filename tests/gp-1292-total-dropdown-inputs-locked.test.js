// gp-1292-total-dropdown-inputs-locked.test.js
// Total dropdown inputs across all exams must equal 21.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) total += (q.inputs || []).filter(i => i.type === 'dropdown').length;
}
const EXPECTED = 21;
console.log('gp-1292-total-dropdown-inputs: ' + total + ' (expected ' + EXPECTED + ')');
if (total !== EXPECTED) { console.log('  FAIL: expected', EXPECTED, 'got', total); process.exit(1); }
console.log('OK -- total dropdown inputs locked at ' + EXPECTED);
