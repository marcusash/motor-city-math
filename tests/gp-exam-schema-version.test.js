// gp-exam-schema-version.test.js — all exams must have a schema_version field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// RP1-10 on schema "1.0", RP11 on "2.0"
const EXPECTED_VERSIONS = { default: '1.0', 'retake-practice-11.json': '2.0' };
const VALID_VERSIONS = new Set(['1.0', '2.0']);

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const version = data.schema_version;
  
  if (!version) {
    fail++;
    issues.push(`${file}: missing schema_version field`);
  } else if (!VALID_VERSIONS.has(String(version))) {
    fail++;
    issues.push(`${file}: invalid schema_version '${version}' (expected '1.0' or '2.0')`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-schema-version: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have valid schema_version`);
