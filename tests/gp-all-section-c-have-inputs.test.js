// gp-all-section-c-have-inputs.test.js — Section C graph questions must have at least 1 input

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
  for (const q of data.questions.filter(q => q.section === 'C')) {
    const inputCount = (q.inputs || []).length;
    if (inputCount === 0) {
      fail++;
      failures.push(`${file}: Q${q.id} Section C has 0 inputs`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-section-c-have-inputs: ${pass} pass, ${fail} no inputs`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section C questions have at least 1 input`);
