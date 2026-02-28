// gp-no-console-in-exam-data.test.js — exam JSON should not embed JavaScript console.log strings

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
  const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  if (/console\.(log|error|warn|debug)/.test(raw)) {
    fail++;
    failures.push(`${file}: contains console.log/error/warn/debug strings`);
  } else {
    pass++;
  }
}

console.log(`gp-no-console-in-exam-data: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exam files are free of console statements`);
