// gp-1070-q12-always-in-section-c.test.js
// Q12 (index 11) must always be in Section C with a graph.

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
  if (q12 && q12.section === 'C' && q12.graph) { pass++; }
  else { fail++; failures.push(`${file}: Q12 (index 11) section="${q12?.section}" hasGraph=${!!q12?.graph} (expected C with graph)`); }
}

console.log(`gp-1070-q12-always-in-section-c: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have Q12 (index 11) in Section C with graph`);
