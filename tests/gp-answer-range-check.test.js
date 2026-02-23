// gp-answer-range-check.test.js — verify numeric answers fall within reasonable algebra ranges

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REASONABLE_MIN = -10000;
const REASONABLE_MAX = 10000;

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (typeof inp.answer !== 'number') continue;
      
      if (inp.answer >= REASONABLE_MIN && inp.answer <= REASONABLE_MAX) {
        pass++;
      } else {
        warn++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' answer=${inp.answer} is outside reasonable range [${REASONABLE_MIN}, ${REASONABLE_MAX}]`);
      }
    }
  }
}

console.log(`gp-answer-range-check: ${pass} pass, ${warn} out of range (informational)`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  console.log('NOTE: Out-of-range answers may be valid — GR to verify');
}
process.exit(0);
