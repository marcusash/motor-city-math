// gp-1022-standard-format-regex.test.js — standards must match W[23].[a-f] pattern

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STD_RE = /^W[23]\.[a-f]$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (STD_RE.test(q.standard || '')) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} standard="${q.standard}" doesn't match W[23].[a-f]`); }
  }
}

console.log(`gp-1022-standard-format-regex: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} standards match W[23].[a-f] format`);
