// gp-1456-type-exponential-count.test.js
// exponential type must appear 28 times total (most common type).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'exponential').length;
}
console.log('gp-1456-type-exponential: ' + total);
if (total === 28) { console.log('OK -- exponential=28 locked'); }
else { console.log('FAIL: expected 28, got ' + total); process.exit(1); }
