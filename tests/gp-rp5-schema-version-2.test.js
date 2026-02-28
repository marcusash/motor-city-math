// gp-rp11-schema-version-2.test.js — RP11 must have schema_version "2.0" (newest schema)
// Note: RP1-10 are schema "1.0", RP11 is schema "2.0"

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-11.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const EXPECTED = '2.0';
console.log(`gp-rp5-schema-version-2: RP11 schema_version="${data.schema_version}" (expected "${EXPECTED}")`);
if (data.schema_version !== EXPECTED) {
  console.log(`  FAIL: RP11 schema_version should be "${EXPECTED}" not "${data.schema_version}"`);
  process.exit(1);
}
console.log(`OK — RP11 is schema_version 2.0 as expected`);
