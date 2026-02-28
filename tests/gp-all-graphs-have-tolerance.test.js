// gp-all-graphs-have-tolerance.test.js — every graph must have a tolerance field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.tolerance === undefined || q.graph.tolerance === null) {
      fail++;
      failures.push(`${file}: Q${q.id} graph missing tolerance field`);
    } else { pass++; }
  }
}

console.log(`gp-all-graphs-have-tolerance: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs have tolerance field`);
