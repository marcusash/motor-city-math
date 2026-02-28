// gp-1296-rp11-schema-version-2.test.js
// RP11 must have schema_version = "2.0" (updated schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-11.json'), 'utf8'));
const sv = data.schema_version;
console.log('gp-1296-rp11-schema-version: schema_version=' + sv);
if (sv !== '2.0') { console.log('  FAIL: RP11 schema_version should be 2.0, got:', sv); process.exit(1); }
console.log('OK -- RP11 schema_version=2.0 locked');
