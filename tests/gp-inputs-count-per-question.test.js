// gp-inputs-count-per-question.test.js
// Each question should have 1-8 inputs — outliers suggest entry error or schema issue

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_INPUTS = 1;
const MAX_INPUTS = 8;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const count = (q.inputs || []).length;
    if (count < MIN_INPUTS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${count} inputs (expected ${MIN_INPUTS}+)`);
    } else if (count > MAX_INPUTS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${count} inputs (expected max ${MAX_INPUTS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-inputs-count-per-question: ${pass} pass, ${warn} out-of-range`);
if (warnings.length) {
  console.log('INFO — input count anomalies:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have 1-8 inputs`);
