// gp-number-inputs-have-answer.test.js — all number-type inputs must have an answer defined

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
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      if (inp.answer === undefined || inp.answer === null) {
        fail++;
        failures.push(`${file}: Q${q.id} input#${inp.id} (number) has no answer`);
      } else { pass++; }
    }
  }
}

console.log(`gp-number-inputs-have-answer: ${pass} pass, ${fail} missing answers`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} number inputs have defined answers`);
