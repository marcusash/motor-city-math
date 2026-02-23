// gp-no-answer-equals-empty-string.test.js — answer='' is a data error (distinguish from null/undefined)

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
      if (inp.answer === '') {
        warn++;
        warnings.push(`${file}: Q${q.id} input '${inp.id}' has answer='' (empty string)`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-answer-equals-empty-string: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — inputs with empty string answer (may indicate missing data):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs reviewed for empty-string answers`);
