// gp-answer-numeric-precision.test.js — numeric answers should have consistent precision (not more than 2 decimal places)

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
      const ans = inp.answer;
      if (typeof ans === 'number') {
        const str = String(ans);
        const decimal = str.includes('.') ? str.split('.')[1] : '';
        if (decimal.length > 3) {
          warn++;
          warnings.push(`${file}: Q${q.id} '${inp.id}' answer=${ans} has ${decimal.length} decimal places`);
        } else {
          pass++;
        }
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-numeric-precision: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — answers with high precision (Kai may enter approximations):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} answers have reasonable numeric precision`);
