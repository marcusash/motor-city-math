// gp-dropdown-answer-in-options.test.js — for dropdown inputs, answer must be a valid option value

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
let skip = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') { skip++; continue; }
      
      const answer = inp.answer;
      const options = inp.options || [];
      
      if (answer === undefined || answer === null) {
        // Orphan input — tracked by gp-no-orphan-inputs, not this test
        skip++;
        continue;
      }
      
      // Check if answer matches any option value (string or number comparison)
      const matchFound = options.some(opt => {
        const v = (opt.value !== undefined) ? opt.value : opt;
        return String(v) === String(answer);
      });
      
      if (matchFound) {
        pass++;
      } else {
        fail++;
        const optVals = options.map(o => (o.value !== undefined) ? o.value : o).join(', ');
        issues.push(`${file}: Q${q.id} input '${inp.id}': answer='${answer}' not in options [${optVals}]`);
      }
    }
  }
}

console.log(`gp-dropdown-answer-in-options: ${pass} pass, ${fail} fail, ${skip} non-dropdown skipped`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} dropdown answers are valid option values`);
