// gp-mc-answer-in-options.test.js — MC answer must be one of the available options

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.type !== 'multiple-choice') continue;
    for (const inp of (q.inputs || [])) {
      if (!inp.options || inp.options.length === 0) continue;
      const ans = String(inp.answer || '');
      const optionValues = inp.options.map(o => String(typeof o === 'object' ? (o.value || o.text || o) : o));
      if (ans && !optionValues.includes(ans)) {
        fail++;
        failures.push(`${file}: Q${q.id} answer='${ans}' not in options [${optionValues.join(', ')}]`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-mc-answer-in-options: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} MC inputs have answers within option set`);
