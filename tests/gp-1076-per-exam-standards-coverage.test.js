// gp-1076-per-exam-standards-coverage.test.js
// Each exam must cover at least 4 distinct standards.

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
  const standards = new Set(data.questions.map(q => q.standard));
  if (standards.size >= MIN_STANDARDS) { pass++; }
  else { fail++; failures.push(`${file}: only ${standards.size} standards (need >= ${MIN_STANDARDS})`); }
}

console.log(`gp-1076-per-exam-standards-coverage: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams cover >= ${MIN_STANDARDS} distinct standards`);
