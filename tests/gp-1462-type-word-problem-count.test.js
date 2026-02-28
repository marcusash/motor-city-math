// gp-1462-type-word-problem-count.test.js
// word-problem type must appear 11 times total (1 per exam).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'word-problem').length;
}
console.log('gp-1462-type-word-problem: ' + total);
if (total === 11) { console.log('OK -- word-problem=11 locked (1 per exam)'); }
else { console.log('FAIL: expected 11, got ' + total); process.exit(1); }
