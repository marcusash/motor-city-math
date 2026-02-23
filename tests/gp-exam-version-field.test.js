// gp-exam-version-field.test.js — check version field (distinct from schema_version)
// version is the iteration within a schema (e.g. '1' or '2.0')

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let missing = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  
  if (data.version !== undefined) {
    pass++;
    console.log(`  OK: ${label} — version: '${data.version}'`);
  } else {
    missing++;
    issues.push(`${label}: missing 'version' field`);
  }
}

console.log(`gp-exam-version-field: ${pass} present, ${missing} missing`);
if (issues.length) {
  console.log('WARN (informational — GI domain):');
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);
