// gp-answer-in-options.test.js — for MC questions, the answer must be one of the option values

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
      if (inp.type !== 'radio' && inp.type !== 'multiple-choice') continue;
      if (inp.answer === undefined || inp.answer === null) continue; // caught by orphan test
      
      const opts = inp.options || [];
      const optValues = opts.map(o => String(o.value));
      const answerStr = String(inp.answer);
      
      if (optValues.includes(answerStr)) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' answer='${inp.answer}' not in options [${optValues.join(', ')}]`);
      }
    }
  }
}

console.log(`gp-answer-in-options: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} MC answers are valid option values`);
