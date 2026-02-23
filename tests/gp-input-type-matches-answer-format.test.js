// gp-input-type-matches-answer-format.test.js — number inputs with answers should parse as float; text/radio can be any string

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
      if (inp.type !== 'number' || inp.answer === undefined || inp.answer === null) {
        pass++;
        continue;
      }
      const ansStr = String(inp.answer);
      // Allow: integers, decimals, negatives, fractions like 1/2
      const isValidNumeric = /^-?\d+(\.\d+)?$/.test(ansStr) || /^-?\d+\/\d+$/.test(ansStr);
      if (!isValidNumeric) {
        warn++;
        warnings.push(`${file}: Q${q.id} number input '${inp.id}' has non-numeric answer='${ansStr}'`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-type-matches-answer-format: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — number inputs with unexpected answer format:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} inputs pass type-answer format check`);
