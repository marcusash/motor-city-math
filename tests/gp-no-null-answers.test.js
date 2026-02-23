// gp-no-null-answers.test.js — answer field should never be null (use undefined/absent instead)

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
    for (const inp of (q.inputs || [])) {
      if (inp.answer === null) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' answer is null (prefer absent field)`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-null-answers: ${pass} pass, ${warn} null answers`);
if (warnings.length) {
  console.log('INFO — null answers found (informational — GR to fill or remove):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs with defined or absent answer, ${warn} null`);
