// gp-graph-function-string-type.test.js — graph.function field must be a string (eval string)

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
    if (typeof q.graph.function !== 'string') {
      fail++;
      failures.push(`${file}: Q${q.id} graph.function is ${typeof q.graph.function} (expected string)`);
    } else { pass++; }
  }
}

console.log(`gp-graph-function-string-type: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph.function fields are strings`);
