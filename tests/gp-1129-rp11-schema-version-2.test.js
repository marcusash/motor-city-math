// gp-1129-rp11-schema-version-2.test.js
// RP11 must have schema_version "2.0", all others "1.0".

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const isRP11 = file.includes('-11.json');
  const expected = isRP11 ? '2.0' : '1.0';
  if (data.schema_version === expected) { pass++; }
  else { fail++; failures.push(`${file}: schema_version="${data.schema_version}" (expected "${expected}")`); }
}

console.log(`gp-1129-rp11-schema-version-2: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- RP11 schema_version=2.0, all others 1.0`);
