// gp-1204-total-standards-count-regression.test.js
// Total standards questions sum must be 165 (sanity: all questions have a standard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) { counts[q.standard] = (counts[q.standard]||0) + 1; }
}
const total = Object.values(counts).reduce((a,b)=>a+b,0);
const stdCount = Object.keys(counts).length;
console.log('gp-1204-total-standards-count: ' + total + ' questions, ' + stdCount + ' distinct standards');
if (total !== 165) { console.log('  FAIL: total should be 165'); process.exit(1); }
console.log('OK -- all 165 questions have a standard; ' + stdCount + ' distinct standards used');
