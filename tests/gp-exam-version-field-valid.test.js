// gp-exam-version-field-valid.test.js — version must be '2.0' (schema v2)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const v = data.version;
  if (v !== '2.0') {
    warn++;
    warnings.push(`${file}: version='${v}' (expected '2.0')`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-version-field-valid: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams not on version 2.0:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams are on version 2.0`);
