// gp-2052-complete-exams-graph-x-range-snapshot.test.js
// Snapshot: 12 graphs have x_range [min,max] (RP6-RP11), 12 have neither x_range nor asymptotes (RP1-5, RP12).
// This documents the actual schema -- asymptotes are embedded in function strings, not a graph field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withRange = 0, withoutRange = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    if (Array.isArray(q.graph.x_range)) withRange++;
    else withoutRange++;
  }
}
console.log('gp-2052-graph-x-range-snapshot: withRange=' + withRange + ' withoutRange=' + withoutRange);
if (withRange !== 12 || withoutRange !== 12) {
  console.log('FAIL: expected withRange=12 withoutRange=12'); process.exit(1);
}
console.log('OK -- graph schema: 12 with x_range (RP6-11), 12 without (RP1-5,RP12)');
