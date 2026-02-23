// gp-exam-data-is-object.test.js — exam JSON must parse to a plain object, not array or primitive

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
  if (typeof data !== 'object' || Array.isArray(data) || data === null) {
    fail++;
    failures.push(`${file}: top-level JSON is ${Array.isArray(data) ? 'array' : typeof data}, not object`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-data-is-object: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams parse to plain objects`);
