// gp-1896-complete-exams-graph-x-range-count-12-lock.test.js
// Exactly 12 of 24 graphs have x_range field (others use asymptotes schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withRange = 0, without = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.x_range) withRange++; else without++;
  }
}
console.log('gp-1896-graph-x-range-count: withRange='+withRange+' without='+without);
if (withRange !== 12 || without !== 12) { console.log('FAIL: expected 12/12'); process.exit(1); }
console.log('OK -- 12 graphs with x_range, 12 without (asymptote schema), total 24');
