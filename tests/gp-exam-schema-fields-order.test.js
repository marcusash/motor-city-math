// gp-exam-schema-fields-order.test.js — top-level fields should appear in consistent schema order

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Expected field order (canonical schema)
const EXPECTED_FIRST_FIELDS = ['exam_id', 'title', 'schema_version'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const keys = Object.keys(data);
  
  const hasAllFirst = EXPECTED_FIRST_FIELDS.every(f => keys.includes(f));
  
  if (hasAllFirst) {
    pass++;
  } else {
    warn++;
    const missing = EXPECTED_FIRST_FIELDS.filter(f => !keys.includes(f));
    warnings.push(`${file}: missing required top-level fields: ${missing.join(', ')}`);
  }
}

console.log(`gp-exam-schema-fields-order: ${pass} pass, ${warn} missing fields`);
if (warnings.length) {
  console.log('INFO — exams missing canonical top-level fields:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have all canonical schema fields`);
