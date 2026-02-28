// gp-answer-is-finite-number-when-numeric.test.js — numeric answers must be finite (not Infinity, NaN)

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
    for (const inp of (q.inputs || [])) {
      const ans = inp.answer;
      if (typeof ans === 'number') {
        if (!isFinite(ans)) {
          fail++;
          failures.push(`${file}: Q${q.id} input '${inp.id}' answer=${ans} is not finite`);
        } else {
          pass++;
        }
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-is-finite-number-when-numeric: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} numeric answers are finite`);
