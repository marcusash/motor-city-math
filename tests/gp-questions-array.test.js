// gp-questions-array.test.js — questions field is an array, not an object
// If questions is an object, iterating it fails and verify breaks

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (!('questions' in data)) {
    fail++;
    violations.push(`${file}: missing questions field`);
  } else if (!Array.isArray(data.questions)) {
    fail++;
    violations.push(`${file}: questions is ${typeof data.questions}, expected Array`);
  } else {
    pass++;
  }
}

console.log(`gp-questions-array: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all RP files have questions as an array');
