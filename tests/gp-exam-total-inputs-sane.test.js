// gp-exam-total-inputs-sane.test.js — total inputs per exam should be between 10 and 50

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_INPUTS = 10;
const MAX_INPUTS = 60;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let total = 0;
  for (const q of data.questions) total += (q.inputs || []).length;
  
  if (total < MIN_INPUTS || total > MAX_INPUTS) {
    warn++;
    warnings.push(`${file}: ${total} total inputs (expected ${MIN_INPUTS}-${MAX_INPUTS})`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-total-inputs-sane: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have ${MIN_INPUTS}-${MAX_INPUTS} total inputs`);
