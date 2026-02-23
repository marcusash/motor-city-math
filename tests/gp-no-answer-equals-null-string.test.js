// gp-no-answer-equals-null-string.test.js — answer should not literally be the string "null"

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
      const ans = inp.answer;
      if (ans === 'null' || ans === 'undefined' || ans === 'NaN') {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' answer='${ans}' (string literal)`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-answer-equals-null-string: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} answer fields are not string 'null'/'undefined'/'NaN'`);
