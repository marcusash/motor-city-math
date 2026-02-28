// gp-1030-number-answer-is-numeric.test.js — number input answers must be parseable as numbers

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
      const val = parseFloat(String(inp.answer).replace(/,/g, ''));
      if (!isNaN(val)) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id}/${inp.id} answer="${inp.answer}" is not numeric`); }
    }
  }
}

console.log(`gp-1030-number-answer-is-numeric: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} number input answers are parseable as numbers`);
