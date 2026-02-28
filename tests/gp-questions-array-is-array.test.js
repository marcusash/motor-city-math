// gp-questions-array-is-array.test.js — questions field must be an Array, not object or null

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
    failures.push(`${file}: questions is ${typeof data.questions} (expected Array)`);
  } else {
    pass++;
  }
}

console.log(`gp-questions-array-is-array: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have a questions Array`);
