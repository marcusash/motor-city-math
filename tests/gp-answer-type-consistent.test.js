// gp-answer-type-consistent.test.js
// For 'number' type inputs, answer should be numeric (not a string like "twenty")

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      if (inp.answer === undefined || inp.answer === null) continue;
      
      const numVal = typeof inp.answer === 'number' ? inp.answer : parseFloat(String(inp.answer));
      if (isNaN(numVal)) {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' is type 'number' but answer='${inp.answer}' is not numeric`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-type-consistent: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} number inputs have numeric answers`);
