// gp-radio-answer-is-string.test.js — radio answer must be a non-empty string

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
      if (inp.type !== 'radio') continue;
      if (typeof inp.answer === 'string' && inp.answer.trim().length > 0) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id}/${inp.id} radio answer="${inp.answer}"`); }
    }
  }
}

console.log(`gp-radio-answer-is-string: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} radio inputs have valid string answers`);
