// gp-exam-has-version-field.test.js — exams should have a version field for change tracking

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
  const ver = data.version;
  if (ver === null || ver === undefined) {
    warn++;
    warnings.push(`${file}: missing version field`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-has-version-field: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams missing version field (GI schema enhancement):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have version field`);
