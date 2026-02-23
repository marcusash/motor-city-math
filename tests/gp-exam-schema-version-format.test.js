// gp-exam-schema-version-format.test.js — schema_version should follow semver (X.Y pattern)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const SEMVER_PATTERN = /^\d+\.\d+$/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sv = data.schema_version;
  if (!sv) {
    fail++;
    issues.push(`${file}: missing schema_version field`);
  } else if (!SEMVER_PATTERN.test(String(sv))) {
    fail++;
    issues.push(`${file}: schema_version='${sv}' does not match X.Y format`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-schema-version-format: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exams have valid schema_version in X.Y format`);
