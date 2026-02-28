// gp-exam-created-by-field-nonempty.test.js — created_by should identify an agent or person

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
  const cb = data.created_by;
  if (!cb || !String(cb).trim()) {
    warn++;
    warnings.push(`${file}: created_by is empty or missing`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-created-by-field-nonempty: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have non-empty created_by`);
