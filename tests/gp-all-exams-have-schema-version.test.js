// gp-all-exams-have-schema-version.test.js — all exams should have a schema_version field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];
const versions = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.schema_version !== 'string' || data.schema_version.trim().length === 0) {
    fail++;
    failures.push(`${file}: missing schema_version`);
  } else {
    pass++;
    versions[data.schema_version] = (versions[data.schema_version] || 0) + 1;
  }
}

console.log(`gp-all-exams-have-schema-version: ${pass} pass, ${fail} fail`);
console.log(`  Distribution: ${JSON.stringify(versions)}`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have schema_version`);
