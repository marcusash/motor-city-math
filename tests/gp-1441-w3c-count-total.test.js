// gp-1441-w3c-count-total.test.js
// W3.c total must be 16 across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W3.c').length;
}
console.log('gp-1441-w3c-total: W3.c appears ' + total + ' times');
if (total === 16) { console.log('OK -- W3.c total locked at 16'); }
else { console.log('FAIL: expected 16, got ' + total); process.exit(1); }
