// gp-1448-total-standards-count-is-10.test.js
// There must be exactly 10 distinct standards used across all questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const standardSet = new Set();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  data.questions.forEach(q => { if (q.standard) standardSet.add(q.standard); });
}
const count = standardSet.size;
console.log('gp-1448-distinct-standards: ' + count + ' distinct standards (' + [...standardSet].sort().join(', ') + ')');
if (count === 10) { console.log('OK -- exactly 10 distinct standards locked'); }
else { console.log('FAIL: expected 10, got ' + count); process.exit(1); }
