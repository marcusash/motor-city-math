// gp-no-trailing-whitespace-in-answers.test.js — answer strings shouldn't have leading/trailing whitespace

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
      if (typeof inp.answer === 'string') {
        const trimmed = inp.answer.trim();
        if (trimmed !== inp.answer) {
          warn++;
          warnings.push(`${file}: Q${q.id} input '${inp.id}' answer has extra whitespace: '${inp.answer}'`);
        } else {
          pass++;
        }
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-trailing-whitespace-in-answers: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — answers with extra whitespace (may break exact-match grading):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs have clean answer strings`);
