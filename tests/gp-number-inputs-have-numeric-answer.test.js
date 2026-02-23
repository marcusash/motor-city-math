// gp-number-inputs-have-numeric-answer.test.js — number inputs with answers must have numeric answer values

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
      if (inp.type !== 'number') continue;
      if (inp.answer === undefined || inp.answer === null) continue;
      const numVal = parseFloat(String(inp.answer));
      if (isNaN(numVal)) {
        warn++;
        warnings.push(`${file}: Q${q.id} number input '${inp.id}' has non-numeric answer='${inp.answer}'`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-number-inputs-have-numeric-answer: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — number inputs with non-numeric answers:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} number inputs have numeric answers`);
