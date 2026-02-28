// gp-each-exam-covers-w3.test.js — every exam must cover at least 1 W3 standard

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
  const hasW3 = data.questions.some(q => q.standard && q.standard.startsWith('W3.'));
  if (!hasW3) {
    fail++;
    failures.push(`${file}: has no W3 standard questions`);
  } else { pass++; }
}

console.log(`gp-each-exam-covers-w3: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams cover at least 1 W3 standard`);
