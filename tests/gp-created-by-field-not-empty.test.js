// gp-created-by-field-not-empty.test.js — created_by field must be present and non-empty

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];
const creators = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const cb = (data.created_by || '').trim();
  if (!cb) {
    warn++;
    warnings.push(`${file}: created_by is empty or missing`);
  } else {
    creators.add(cb);
    pass++;
  }
}

console.log(`gp-created-by-field-not-empty: ${pass} pass, ${warn} missing`);
console.log(`  Creators: ${[...creators].join(', ')}`);
if (warnings.length) {
  console.log('INFO — exams missing created_by:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have created_by field`);
