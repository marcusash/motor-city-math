// gp-exam-purpose-field.test.js — all RP exams should have a purpose field describing exam intent

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const purpose = (data.purpose || '').trim();
  if (purpose.length >= 10) {
    pass++;
  } else {
    warn++;
    issues.push(`${file}: missing or empty 'purpose' field (helps document exam intent)`);
  }
}

console.log(`gp-exam-purpose-field: ${pass} pass, ${warn} missing purpose`);
if (issues.length) {
  issues.forEach(i => console.log('  WARN:', i));
}
// Informational only — purpose is optional
process.exit(0);
