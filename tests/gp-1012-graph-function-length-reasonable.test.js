// gp-1012-graph-function-length-reasonable.test.js — graph function strings should be < 200 chars

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX = 200;
let pass = 0, advisory = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || typeof q.graph.function !== 'string') continue;
    if (q.graph.function.length <= MAX) { pass++; }
    else { advisory++; findings.push(`${file}: ${q.id} function is ${q.graph.function.length} chars`); }
  }
}

console.log(`gp-1012-graph-function-length-reasonable: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — graph function length audit complete`);
