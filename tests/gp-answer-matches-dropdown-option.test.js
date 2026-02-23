// gp-answer-matches-dropdown-option.test.js — dropdown answer must match one of the options

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
      if (inp.type !== 'dropdown') continue;
      const opts = (inp.options || []).map(o => String(o));
      const ans = inp.answer;
      if (ans === null || ans === undefined || ans === '') {
        pass++; // no answer = not our domain
        continue;
      }
      if (!opts.includes(String(ans))) {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' answer='${ans}' not in options: [${opts.join(', ')}]`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-matches-dropdown-option: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} dropdown answers match available options`);
