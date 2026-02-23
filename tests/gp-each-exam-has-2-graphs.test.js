// gp-each-exam-has-2-graphs.test.js — each exam must have exactly 2 graphs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 2;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const graphCount = data.questions.filter(q => q.graph).length;
  if (graphCount !== EXPECTED) {
    fail++;
    failures.push(`${file}: has ${graphCount} graphs (expected exactly ${EXPECTED})`);
  } else { pass++; }
}

console.log(`gp-each-exam-has-2-graphs: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have exactly 2 graphs`);
