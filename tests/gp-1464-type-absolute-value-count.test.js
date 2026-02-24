// gp-1464-type-absolute-value-count.test.js
// absolute-value type must appear 8 times total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'absolute-value').length;
}
console.log('gp-1464-type-absolute-value: ' + total);
if (total === 8) { console.log('OK -- absolute-value=8 locked (RP8-11 Q2=absolute-value, 2x each)'); }
else { console.log('FAIL: expected 8, got ' + total); process.exit(1); }
