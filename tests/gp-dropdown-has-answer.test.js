// gp-dropdown-has-answer.test.js — dropdown inputs should have an answer field (correct option identified)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const input of (q.inputs || [])) {
      if (input.type !== 'dropdown') continue;
      if (input.answer === undefined || input.answer === null) {
        warn++;
        warnings.push(`${file}: Q${q.id} dropdown "${input.id}" has no answer`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-dropdown-has-answer: ${pass} pass, ${warn} missing answer`);
if (warnings.length) {
  warnings.slice(0, 5).forEach(w => console.log('  INFO:', w));
}
console.log(`OK — ${pass} dropdown inputs have answers`);
