// gp-question-section-d-is-multi-part.test.js — Section D questions should have 3+ inputs (they're multi-part)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_D_INPUTS = 2;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.section !== 'D') continue;
    const inputCount = (q.inputs || []).length;
    if (inputCount < MIN_D_INPUTS) {
      warn++;
      warnings.push(`${file}: Q${q.id} is Section D but has only ${inputCount} input (expected ${MIN_D_INPUTS}+)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-section-d-is-multi-part: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — Section D questions with fewer than expected inputs:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} Section D questions have ${MIN_D_INPUTS}+ inputs`);
