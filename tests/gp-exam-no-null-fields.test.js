// gp-exam-no-null-fields.test.js — top-level fields must not be null (can be absent but not null)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const KEY_FIELDS = ['exam_id', 'title', 'subtitle', 'version', 'schema_version', 'created', 'created_by', 'time_minutes', 'purpose'];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let fileOk = true;
  for (const field of KEY_FIELDS) {
    if (data[field] === null) {
      fail++;
      failures.push(`${file}: field '${field}' is null (should be absent or have a value)`);
      fileOk = false;
    }
  }
  if (fileOk) pass++;
}

console.log(`gp-exam-no-null-fields: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have no null top-level fields`);
