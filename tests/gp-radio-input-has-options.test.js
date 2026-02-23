// gp-radio-input-has-options.test.js — every radio input must have options array and answer field

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
      const hasOptions = Array.isArray(inp.options) && inp.options.length > 0;
      const hasAnswer = typeof inp.answer === 'string' && inp.answer.trim().length > 0;
      if (hasOptions && hasAnswer) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id}/${inp.id} radio missing options/answer`); }
    }
  }
}

console.log(`gp-radio-input-has-options: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} radio inputs have options array and answer field`);
