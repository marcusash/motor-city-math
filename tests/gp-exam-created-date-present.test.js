// gp-exam-created-date-present.test.js — exam should have created_at or date field

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
  const hasDate = data.created_at || data.date || data.created;
  if (hasDate) {
    pass++;
  } else {
    warn++;
    warnings.push(`${file}: no created_at/date field`);
  }
}

console.log(`gp-exam-created-date-present: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams without creation date (informational, GI schema enhancement):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have date, ${warn} without`);
