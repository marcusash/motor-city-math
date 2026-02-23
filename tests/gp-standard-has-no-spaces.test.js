// gp-standard-has-no-spaces.test.js — standard values must not contain spaces

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard || '';
    if (std.includes(' ')) {
      fail++;
      failures.push(`${file}: ${q.id} standard="${std}" contains space`);
    } else { pass++; }
  }
}

console.log(`gp-standard-has-no-spaces: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} standards have no spaces`);
