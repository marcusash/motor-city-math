// gp-questions-field-is-array.test.js — every exam JSON must have questions as a proper array

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
  if (!Array.isArray(data.questions)) {
    fail++;
    failures.push(`${file}: questions field is ${typeof data.questions} (expected array)`);
  } else if (data.questions.length === 0) {
    fail++;
    failures.push(`${file}: questions array is empty`);
  } else {
    pass++;
  }
}

console.log(`gp-questions-field-is-array: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exam files have non-empty questions arrays`);
