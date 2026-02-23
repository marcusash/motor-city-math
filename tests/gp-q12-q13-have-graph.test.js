// gp-q12-q13-have-graph.test.js — Q12 and Q13 (Section C) must have graph property

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
  const q12 = data.questions[11]; // index 11 = 12th question
  const q13 = data.questions[12]; // index 12 = 13th question
  
  [['Q12', q12], ['Q13', q13]].forEach(([label, q]) => {
    if (!q) { fail++; failures.push(`${file}: ${label} not found`); return; }
    if (!q.graph) {
      fail++;
      failures.push(`${file}: ${label} (id=${q.id}) has no graph (section=${q.section})`);
    } else {
      pass++;
    }
  });
}

console.log(`gp-q12-q13-have-graph: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} Q12/Q13 across 11 exams have graph property`);
