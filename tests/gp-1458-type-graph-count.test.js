// gp-1458-type-graph-count.test.js
// graph type must appear 21 times total.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.type === 'graph').length;
}
console.log('gp-1458-type-graph: ' + total);
if (total === 21) { console.log('OK -- graph type=21 locked (RP1-10 have Q12+Q13=graph, RP11 Q12 only)'); }
else { console.log('FAIL: expected 21, got ' + total); process.exit(1); }
