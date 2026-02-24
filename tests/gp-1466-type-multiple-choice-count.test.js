// gp-1466-type-multiple-choice-count.test.js
// multiple-choice type must appear 5 times total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'multiple-choice').length;
}
console.log('gp-1466-type-multiple-choice: ' + total);
if (total === 5) { console.log('OK -- multiple-choice=5 locked'); }
else { console.log('FAIL: expected 5, got ' + total); process.exit(1); }
