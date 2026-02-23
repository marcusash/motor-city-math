// gp-exam-version-is-two-point-zero.test.js — version field should be '2.0' for all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];
const versions = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const v = data.version;
  versions[file] = v;
  if (v === '2.0') {
    pass++;
  } else {
    warn++;
    warnings.push(`${file}: version='${v}' (expected '2.0')`);
  }
}

console.log(`gp-exam-version-is-two-point-zero: ${pass} pass, ${warn} not-2.0`);
if (warnings.length) {
  console.log('INFO — exams not at version 2.0:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — version audit complete (${pass}/11 at v2.0)`);
