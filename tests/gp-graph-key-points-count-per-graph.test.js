// gp-graph-key-points-count-per-graph.test.js — track key_points count distribution per graph

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const dist = {};
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !Array.isArray(q.graph.key_points)) continue;
    const count = q.graph.key_points.length;
    dist[count] = (dist[count] || 0) + 1;
    total++;
  }
}

console.log(`gp-graph-key-points-count-per-graph: ${total} graphs audited`);
Object.entries(dist).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([k,v]) => {
  console.log(`  ${k} key_points: ${v} graphs`);
});
console.log(`OK — key_points count distribution audit complete`);
