// gp-section-b-min-inputs.test.js — every Section B question must have at least 1 input

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
  for (const q of data.questions.filter(q => q.section === 'B')) {
    const inputCount = (q.inputs || []).length;
    if (inputCount === 0) {
      fail++;
      failures.push(`${file}: Q${q.id} Section B has 0 inputs`);
    } else { pass++; }
  }
}

console.log(`gp-section-b-min-inputs: ${pass} pass, ${fail} no inputs`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section B questions have at least 1 input`);
