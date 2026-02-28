// gp-all-exams-have-created-by.test.js — all exams must have a created_by field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_AUTHORS = new Set([
  'GR', 'Marcus', 'marcus', 'FR', 'FA', 'GI', 'GP', 'GA',
  'Agent GA', 'Agent GR', 'Agent FR', 'Agent R', 'Agent GI'
]);

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const cb = data.created_by || '';
  if (!cb) {
    warn++;
    warnings.push(`${file}: missing created_by`);
  } else if (!VALID_AUTHORS.has(cb)) {
    warn++;
    warnings.push(`${file}: created_by='${cb}' not in known author list`);
  } else {
    pass++;
    console.log(`  ${file}: created_by=${cb}`);
  }
}

console.log(`gp-all-exams-have-created-by: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — unknown or missing authors:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have recognized created_by`);
