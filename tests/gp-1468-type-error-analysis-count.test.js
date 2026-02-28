// gp-1468-type-error-analysis-count.test.js
// error-analysis type must appear 1 time total (rare, monitor for growth).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0; const found = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const qs = data.questions.filter(q => q.type === 'error-analysis');
  if (qs.length) qs.forEach(q => found.push(file + ':' + q.id));
  total += qs.length;
}
console.log('gp-1468-type-error-analysis: ' + total + ' (' + found.join(', ') + ')');
if (total === 1) { console.log('OK -- error-analysis=1 locked'); }
else { console.log('FAIL: expected 1, got ' + total); process.exit(1); }
