// gp-answer-not-nan-string.test.js — answer should not be the string 'NaN'

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
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer === 'NaN' || inp.answer === 'nan' || inp.answer === 'Nan') {
        fail++;
        failures.push(`${file}: Q${q.id} input '${inp.id}' has answer='${inp.answer}'`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-not-nan-string: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} inputs are free of NaN string answers`);
