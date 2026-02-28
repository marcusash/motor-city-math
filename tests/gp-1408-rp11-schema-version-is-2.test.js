// gp-1408-rp11-schema-version-is-2.test.js
// RP11 must have schema_version "2.0".

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-11.json'), 'utf8'));
if (data.schema_version === '2.0') {
  console.log('gp-1408-rp11-schema-v2: 1 pass, 0 fail');
  console.log('OK -- RP11 has schema_version=2.0');
} else {
  console.log('gp-1408-rp11-schema-v2: 0 pass, 1 fail');
  console.log('  FAIL: schema_version=' + data.schema_version);
  process.exit(1);
}
