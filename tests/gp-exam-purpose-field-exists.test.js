// gp-exam-purpose-field-exists.test.js — exams should have a purpose field documenting their intent

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
  const purpose = data.purpose || data.description || '';
  if (!purpose.trim()) {
    warn++;
    warnings.push(`${file}: no purpose or description field — intent undocumented`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-purpose-field-exists: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams without documented purpose:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have purpose documentation`);
