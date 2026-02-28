// gp-rp-file-has-questions-key.test.js — every RP file has a questions array key
// Without questions key, verify tooling silently skips the whole exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (!Array.isArray(data.questions)) {
    fail++;
    violations.push(`${file}: questions key missing or not array`);
  } else if (data.questions.length === 0) {
    fail++;
    violations.push(`${file}: questions array is empty`);
  } else {
    pass++;
  }
}

console.log(`gp-rp-file-has-questions-key: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log(`OK — all ${pass} RP files have a non-empty questions array`);
