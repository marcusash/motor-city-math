// gp-exam-json-top-level-keys.test.js — exam JSON should have all required top-level keys

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_KEYS = ['exam_id', 'title', 'subtitle', 'version', 'schema_version', 
                        'created', 'created_by', 'time_minutes', 'purpose', 'questions'];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const missing = REQUIRED_KEYS.filter(k => data[k] === undefined);
  if (missing.length > 0) {
    fail++;
    failures.push(`${file}: missing keys: ${missing.join(', ')}`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-json-top-level-keys: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have required top-level keys`);
