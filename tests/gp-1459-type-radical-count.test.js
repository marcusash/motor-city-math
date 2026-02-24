// gp-1459-type-radical-count.test.js
// radical type must appear 21 times total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'radical').length;
}
console.log('gp-1459-type-radical: ' + total);
if (total === 21) { console.log('OK -- radical=21 locked'); }
else { console.log('FAIL: expected 21, got ' + total); process.exit(1); }
