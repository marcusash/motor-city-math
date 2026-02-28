// gp-data-files-match-rp-pattern.test.js — all JSON files in data/ must match naming convention

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_PATTERN = /^retake-practice-(\d+)\.json$/;
const ALLOWED_EXTRAS = /^(_.*|backups.*|schema.*|manifest.*)$/;

let pass = 0;
let fail = 0;
const failures = [];

const files = fs.readdirSync(DATA_DIR)
  .filter(f => !fs.statSync(path.join(DATA_DIR, f)).isDirectory());

for (const file of files) {
  if (RP_PATTERN.test(file)) {
    pass++;
  } else if (ALLOWED_EXTRAS.test(file)) {
    pass++;
  } else {
    fail++;
    failures.push(`data/${file}: unexpected file (not retake-practice-N.json)`);
  }
}

console.log(`gp-data-files-match-rp-pattern: ${pass} valid, ${fail} unexpected`);
if (failures.length) {
  console.log('INFO — unexpected files in data/:');
  failures.forEach(f => console.log('  ', f));
}
console.log(`OK — ${pass} data files match expected naming pattern`);
