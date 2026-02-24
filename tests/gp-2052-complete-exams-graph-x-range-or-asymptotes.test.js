// gp-2052-complete-exams-graph-x-range-or-asymptotes.test.js
// Each graph has EITHER x_range [min,max] OR asymptotes (not both, not neither).
// Snapshot: 12 have x_range, 12 have asymptotes.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withRange = 0, withAsymptotes = 0, neither = 0, both = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    const g = q.graph;
    const hasRange = Array.isArray(g.x_range);
    const hasAsym = Array.isArray(g.asymptotes);
    if (hasRange && !hasAsym) withRange++;
    else if (!hasRange && hasAsym) withAsymptotes++;
    else if (hasRange && hasAsym) both++;
    else neither++;
  }
}
console.log('gp-2052-graph-schema-split: x_range=' + withRange + ' asymptotes=' + withAsymptotes + ' both=' + both + ' neither=' + neither);
if (withRange !== 12 || withAsymptotes !== 12 || both !== 0 || neither !== 0) {
  console.log('FAIL: expected x_range=12 asymptotes=12 both=0 neither=0'); process.exit(1);
}
console.log('OK -- graph schema split: 12 x_range, 12 asymptotes, mutually exclusive');
