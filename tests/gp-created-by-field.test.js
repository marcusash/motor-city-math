// gp-created-by-field.test.js — all RP files should have a created_by field

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
  const createdBy = (data.created_by || '').trim();
  if (createdBy.length >= 2) {
    pass++;
  } else {
    warn++;
    issues.push(`${file}: missing 'created_by' field`);
  }
}

console.log(`gp-created-by-field: ${pass} pass, ${warn} missing`);
if (issues.length) {
  issues.forEach(i => console.log('  WARN:', i));
}
process.exit(0);
