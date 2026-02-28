// gp-1461-type-quadratic-count.test.js
// quadratic type must appear 15 times total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'quadratic').length;
}
console.log('gp-1461-type-quadratic: ' + total);
if (total === 15) { console.log('OK -- quadratic=15 locked'); }
else { console.log('FAIL: expected 15, got ' + total); process.exit(1); }
