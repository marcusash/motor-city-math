// gp-exam-has-no-empty-hint.test.js — no question should have an empty string hint (null is ok, empty is not)

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
    // hint field must be either a non-empty string or absent/null
    if (q.hint === '') {
      fail++;
      failures.push(`${file}: Q${q.id} has hint="" (should be null or a real hint)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-exam-has-no-empty-hint: ${pass} pass, ${fail} empty-string hint`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have null or non-empty hint`);
