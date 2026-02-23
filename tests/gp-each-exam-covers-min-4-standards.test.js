// gp-each-exam-covers-min-4-standards.test.js — each exam should cover at least 4 distinct standards

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_STANDARDS = 4;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const standards = new Set(data.questions.map(q => q.standard).filter(Boolean));
  if (standards.size < MIN_STANDARDS) {
    fail++;
    failures.push(`${file}: only ${standards.size} distinct standards (min ${MIN_STANDARDS}): ${[...standards].join(', ')}`);
  } else { pass++; }
}

console.log(`gp-each-exam-covers-min-4-standards: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams cover at least ${MIN_STANDARDS} distinct standards`);
