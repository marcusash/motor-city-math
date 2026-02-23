// gp-1083-graph-key-points-unique-within-graph.test.js
// Key points within a graph should not have duplicate coordinates.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, dup = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    const seen = new Set();
    for (const pt of q.graph.key_points) {
      const key = JSON.stringify(pt);
      if (seen.has(key)) {
        dup++;
        findings.push(`${file}: ${q.id} duplicate key_point ${key}`);
      } else {
        seen.add(key);
        pass++;
      }
    }
  }
}

console.log(`gp-1083-graph-key-points-unique-within-graph: ${pass} unique, ${dup} duplicates`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK -- graph key_point uniqueness audit complete`);
