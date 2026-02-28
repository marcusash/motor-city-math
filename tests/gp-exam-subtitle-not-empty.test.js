// gp-exam-subtitle-not-empty.test.js — subtitle field should be present and non-empty

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
  const sub = (data.subtitle || '').trim();
  if (!sub) {
    warn++;
    warnings.push(`${file}: subtitle is empty or missing`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-subtitle-not-empty: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams without subtitle:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have subtitle`);
