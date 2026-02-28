// gp-rp-has-exam-metadata.test.js — verify each RP file has required top-level metadata fields

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_TOP_LEVEL = ['exam_id', 'title', 'questions'];
const OPTIONAL_BUT_CHECKED = ['version', 'schema_version'];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  
  for (const field of REQUIRED_TOP_LEVEL) {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: missing required field '${field}'`);
    }
  }
  
  for (const field of OPTIONAL_BUT_CHECKED) {
    if (data[field] !== undefined) {
      pass++;
    } else {
      // Informational only — not a hard fail
      issues.push(`WARN ${file}: optional field '${field}' not present`);
    }
  }
}

const hardFails = issues.filter(i => !i.startsWith('WARN'));
console.log(`gp-rp-has-exam-metadata: ${pass} pass, ${fail} fail`);
if (hardFails.length) {
  console.log('FAILURES:');
  hardFails.forEach(i => console.log('  ', i));
}
const warns = issues.filter(i => i.startsWith('WARN'));
if (warns.length) {
  console.log('WARNINGS (informational):');
  warns.forEach(i => console.log('  ', i));
}
if (fail > 0) process.exit(1);
else console.log('OK — all required metadata fields present');
