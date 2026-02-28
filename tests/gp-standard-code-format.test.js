// gp-standard-code-format.test.js — all standards must match W{N}.{letter} format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STD_PATTERN = /^W\d+\.[a-z]+$/;

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard;
    if (!std || !STD_PATTERN.test(std)) {
      fail++;
      failures.push(`${file}: Q${q.id} standard='${std}' does not match W{N}.{letter}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-standard-code-format: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  if (fail > 5) console.log(`  ... and ${fail - 5} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} questions have valid standard codes`);
