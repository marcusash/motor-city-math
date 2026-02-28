// gp-1042-graph-function-has-x.test.js — graph function strings should reference x variable

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
    if (!q.graph || typeof q.graph.function !== 'string') continue;
    if (/\bx\b/.test(q.graph.function)) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} function="${q.graph.function}" has no x variable`); }
  }
}

console.log(`gp-1042-graph-function-has-x: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph functions reference x variable`);
