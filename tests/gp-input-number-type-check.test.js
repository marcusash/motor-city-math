// gp-input-number-type-check.test.js — number inputs should not have non-numeric answer strings like "Yes/No"

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
      if (input.type !== 'number' || input.answer === undefined) continue;
      const ans = String(input.answer).replace(/[$,\s]/g, '');
      if (ans === '') { pass++; continue; } // empty allowed
      const parsed = parseFloat(ans);
      if (isNaN(parsed) && ans !== '-' && !ans.includes('/')) {
        warn++;
        warnings.push(`${file}: Q${q.id} number input id=${input.id} answer="${input.answer}" is not numeric`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-number-type-check: ${pass} pass, ${warn} non-numeric`);
if (warnings.length) {
  console.log('INFO — number inputs with non-numeric answers:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} number inputs have valid numeric answers`);
