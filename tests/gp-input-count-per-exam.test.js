// gp-input-count-per-exam.test.js — track total inputs per exam, flag if below 15 (avg ~1 per question)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_INPUTS = 15;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const totalInputs = data.questions.reduce((sum, q) => sum + (q.inputs || []).length, 0);
  if (totalInputs < MIN_INPUTS) {
    warn++;
    warnings.push(`${file}: only ${totalInputs} inputs (min ${MIN_INPUTS})`);
  } else {
    pass++;
    console.log(`  ${file}: ${totalInputs} inputs`);
  }
}

console.log(`gp-input-count-per-exam: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with very few inputs:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have adequate input coverage`);
