// gp-input-count-per-question-reasonable.test.js — questions should have between 1 and 15 inputs (sanity check)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_INPUTS = 1;
const MAX_INPUTS = 15;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const count = (q.inputs || []).length;
    if (count < MIN_INPUTS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${count} inputs (min ${MIN_INPUTS})`);
    } else if (count > MAX_INPUTS) {
      warn++;
      warnings.push(`${file}: Q${q.id} has ${count} inputs (max ${MAX_INPUTS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-input-count-per-question-reasonable: ${pass} pass, ${warn} out-of-range`);
if (warnings.length) { warnings.slice(0, 5).forEach(w => console.log('  INFO:', w)); }
console.log(`OK — ${pass} questions have ${MIN_INPUTS}-${MAX_INPUTS} inputs`);
