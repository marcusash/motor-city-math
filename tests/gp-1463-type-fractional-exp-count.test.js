// gp-1463-type-fractional-exp-count.test.js
// fractional-exp type must appear 11 times total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'fractional-exp').length;
}
console.log('gp-1463-type-fractional-exp: ' + total);
if (total === 11) { console.log('OK -- fractional-exp=11 locked'); }
else { console.log('FAIL: expected 11, got ' + total); process.exit(1); }
