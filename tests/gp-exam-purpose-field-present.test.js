// gp-exam-purpose-field-present.test.js — all exams must have a purpose field

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
  const purpose = (data.purpose || '').trim();
  if (!purpose) {
    warn++;
    warnings.push(`${file}: missing or empty purpose field`);
  } else {
    pass++;
    console.log(`  ${file}: "${purpose.substring(0, 50)}"`);
  }
}

console.log(`gp-exam-purpose-field-present: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams missing purpose field:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have purpose field`);
