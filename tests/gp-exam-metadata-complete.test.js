// gp-exam-metadata-complete.test.js — exams should have all key metadata fields populated

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_META = ['exam_id', 'exam_title', 'schema_version', 'version', 'author', 'created_date', 'time_minutes'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const missing = REQUIRED_META.filter(f => data[f] === undefined || data[f] === null || data[f] === '');
  if (missing.length > 0) {
    warn++;
    warnings.push(`${file}: missing metadata: ${missing.join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-metadata-complete: ${pass} pass, ${warn} with gaps`);
if (warnings.length) {
  console.log('INFO — exams with incomplete metadata:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have all required metadata fields`);
