// gp-exam-has-no-extra-top-fields.test.js — audit unexpected top-level fields in exam JSON

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const KNOWN_FIELDS = new Set([
  'exam_id', 'title', 'subtitle', 'version', 'schema_version', 'created', 'created_by',
  'time_minutes', 'purpose', 'questions'
]);

let pass = 0;
const unknownFields = new Map();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const key of Object.keys(data)) {
    if (!KNOWN_FIELDS.has(key)) {
      if (!unknownFields.has(key)) unknownFields.set(key, []);
      unknownFields.get(key).push(file.replace('retake-practice-','RP').replace('.json',''));
    } else {
      pass++;
    }
  }
}

console.log(`gp-exam-has-no-extra-top-fields: ${pass} known fields, ${unknownFields.size} unknown`);
if (unknownFields.size > 0) {
  for (const [field, exams] of unknownFields) {
    console.log(`  Unknown field "${field}" in: ${exams.join(', ')}`);
  }
  console.log(`  INFO: Update KNOWN_FIELDS if these are valid additions`);
}
console.log(`OK — top-level field audit complete`);
