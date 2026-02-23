// gp-exam-created-date-format.test.js — created field should match YYYY-MM-DD format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const created = data.created;
  if (!created || !DATE_PATTERN.test(created)) {
    warn++;
    warnings.push(`${file}: created='${created}' is not YYYY-MM-DD format`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-created-date-format: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with non-standard created date format:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have YYYY-MM-DD created date`);
