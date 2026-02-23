// gp-mc-correct-index.test.js — MC/radio answers match one of the option values
// If answer is "E" but only options A-D exist, Kai can never get it right

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    const inputs = q.inputs || [];
    for (const inp of inputs) {
      if (inp.type === 'radio' || inp.type === 'dropdown') {
        if (!inp.options || !Array.isArray(inp.options)) {
          fail++;
          violations.push(`${file} Q${q.id || q.number} input "${inp.id}": ${inp.type} has no options array`);
          continue;
        }
        const optionValues = inp.options.map(o => o.value || o);
        if (inp.answer !== undefined && !optionValues.includes(inp.answer)) {
          fail++;
          violations.push(`${file} Q${q.id || q.number} input "${inp.id}": answer "${inp.answer}" not in options [${optionValues.join(', ')}]`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-mc-correct-index: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all MC/radio answers are valid options');
