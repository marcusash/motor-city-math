// gp-1460-type-rational-count.test.js
// rational type must appear 12 times total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'rational').length;
}
console.log('gp-1460-type-rational: ' + total);
if (total === 12) { console.log('OK -- rational=12 locked'); }
else { console.log('FAIL: expected 12, got ' + total); process.exit(1); }
