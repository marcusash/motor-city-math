// gp-exam-schema-version-value.test.js — schema_version should be '1.0' or '2.0' (valid known versions)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_SCHEMA_VERSIONS = new Set(['1.0', '2.0']);

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sv = data.schema_version;
  if (!VALID_SCHEMA_VERSIONS.has(sv)) {
    fail++;
    failures.push(`${file}: schema_version='${sv}' is not a recognized version (expected '1.0' or '2.0')`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-schema-version-value: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have valid schema_version`);
