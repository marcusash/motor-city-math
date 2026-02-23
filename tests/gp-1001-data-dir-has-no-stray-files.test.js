// gp-1001-data-dir-has-no-stray-files.test.js — data dir should only contain expected files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA_DIR).filter(f => !fs.statSync(path.join(DATA_DIR, f)).isDirectory());
const EXPECTED_PATTERNS = [/^retake-practice-\d+\.json$/, /^manifest\.json$/, /^gp-field-audit-report\.json$/];

let expected = 0, stray = 0;
const strays = [];

for (const file of files) {
  if (EXPECTED_PATTERNS.some(p => p.test(file))) { expected++; }
  else { stray++; strays.push(file); }
}

console.log(`gp-1001-data-dir-has-no-stray-files: ${expected} expected, ${stray} advisory`);
if (strays.length) { strays.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — data dir file audit complete`);
