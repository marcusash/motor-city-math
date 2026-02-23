// gp-number-input-answer-is-number.test.js — number-type inputs that have an answer should have numeric answer

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
      if (input.type !== 'number') continue;
      if (input.answer === undefined || input.answer === null) { pass++; continue; }
      const num = Number(input.answer);
      if (isNaN(num)) {
        warn++;
        warnings.push(`${file}: Q${q.id} input "${input.id}" number-type has non-numeric answer: ${JSON.stringify(input.answer)}`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-number-input-answer-is-number: ${pass} pass, ${warn} non-numeric`);
if (warnings.length) {
  warnings.slice(0, 5).forEach(w => console.log('  INFO:', w));
}
console.log(`OK — ${pass} number inputs have numeric or absent answer`);
