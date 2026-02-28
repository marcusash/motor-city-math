// gp-no-answer-of-false.test.js — answer should not be boolean false (schema confusion with null)

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
      if (inp.answer === false || inp.answer === true) {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' answer is boolean ${inp.answer}`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-answer-of-false: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} answer fields are not boolean values`);
