// gp-graphs-are-always-q12-q13.test.js — graph questions must be at index 11 and 12 (Q12 and Q13) in every exam

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
  const graphIndices = data.questions.map((q, i) => q.graph ? i : -1).filter(i => i !== -1);
  if (JSON.stringify(graphIndices) === JSON.stringify([11, 12])) { pass++; }
  else { fail++; failures.push(`${file}: graphs at indices ${graphIndices} (expected [11,12])`); }
}

console.log(`gp-graphs-are-always-q12-q13: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have graphs exactly at Q12 and Q13 (indices 11,12)`);
