// gp-standard-format-regex.test.js — standards must match W{N}.{a-f} format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STANDARD_RE = /^W[23]\.[a-f]$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (typeof q.standard !== 'string') continue;
    if (!STANDARD_RE.test(q.standard)) {
      fail++;
      failures.push(`${file}: ${q.id}.standard="${q.standard}" (expected W2/3.a-f)`);
    } else { pass++; }
  }
}

console.log(`gp-standard-format-regex: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} standards match W{2|3}.{a-f} format`);
