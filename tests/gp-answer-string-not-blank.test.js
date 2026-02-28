// gp-answer-string-not-blank.test.js — answer fields that exist must not be empty or whitespace-only

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
      if (inp.answer === undefined || inp.answer === null) continue; // missing answer handled elsewhere
      const val = String(inp.answer).trim();
      if (!val) {
        fail++;
        failures.push(`${file}: Q${q.id} input '${inp.id}' has blank/empty answer`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-string-not-blank: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} existing answers are non-blank`);
