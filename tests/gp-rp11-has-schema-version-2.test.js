// gp-rp11-has-schema-version-2.test.js — RP11 must have schema_version "2.0"

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-11.json'), 'utf8'));

const sv = data.schema_version;
console.log(`gp-rp11-has-schema-version-2: schema_version="${sv}"`);
if (sv === '2.0') {
  console.log(`OK — RP11 schema_version is "2.0"`);
} else {
  console.log(`  FAIL: expected "2.0" got "${sv}"`);
  process.exit(1);
}
