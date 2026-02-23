// gp-graph-function-uses-x.test.js — graph function string must reference variable 'x'

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const fn = q.graph.function || '';
    // Must reference 'x' as a variable (not just as substring of Math.exp etc.)
    if (!/\bx\b/.test(fn)) {
      fail++;
      failures.push(`${file}: Q${q.id} graph function "${fn}" does not reference x`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-function-uses-x: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph functions use variable x`);
