// gp-1114-section-c-q12-type-is-graph.test.js
// Q12 (index 11) in all exams must have type = "graph".

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
  const q12 = data.questions[11];
  if (q12 && q12.type === 'graph') { pass++; }
  else { fail++; failures.push(`${file}: Q12 type="${q12?.type}" (expected "graph")`); }
}

console.log(`gp-1114-section-c-q12-type-is-graph: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} Q12 questions have type "graph"`);
