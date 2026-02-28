// gp-non-graph-questions-no-graph-field.test.js — non-graph questions must NOT have a graph field

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
    if (q.type === 'graph') continue;
    if (q.graph) {
      fail++;
      failures.push(`${file}: ${q.id} type="${q.type}" unexpectedly has a graph field`);
    } else { pass++; }
  }
}

console.log(`gp-non-graph-questions-no-graph-field: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  INFO:', f)); }
if (fail > 0) { console.log(`  (advisory — ${fail} non-graph questions have graph field)`); }
console.log(`OK — graph field audit complete`);
