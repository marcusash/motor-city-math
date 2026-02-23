// gp-per-exam-standards-unique.test.js — each exam should cover multiple unique standards

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
  const standards = new Set(data.questions.map(q => q.standard).filter(Boolean));
  if (standards.size >= 3) { pass++; }
  else { fail++; failures.push(`${file}: only ${standards.size} unique standards (expected >= 3)`); }
}

console.log(`gp-per-exam-standards-unique: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams cover 3+ unique standards`);
