// gp-answer-not-empty-string.test.js — answer field should not be empty string ""

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer === '') {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' answer is empty string ""`);
      } else if (inp.answer !== undefined && inp.answer !== null) {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-not-empty-string: ${pass} valid answers, ${fail} empty string answers`);
if (issues.length) {
  console.log('EMPTY STRING ANSWERS — use null or remove field if answer not known (GR domain):');
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — no empty string answers found`);
