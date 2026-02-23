// gp-all-rp-schema-v2.test.js — report schema_version status across all RP files
// Informational: only RP11 has been migrated to 2.0 so far. GR/GI own migration.
// This test reports findings; it does NOT fail on v1.0 files (expected state).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const REQUIRED_SCHEMA_VERSION = '2.0';

let v2 = 0;
let v1 = 0;
const v1Files = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.schema_version === REQUIRED_SCHEMA_VERSION) {
    v2++;
  } else {
    v1++;
    v1Files.push(`${file}: schema_version="${data.schema_version}"`);
  }
}

console.log(`gp-all-rp-schema-v2: ${v2} on v2.0, ${v1} on earlier versions`);
if (v1Files.length) {
  console.log('FILES NOT YET ON v2.0 (inform GR/GI):');
  v1Files.forEach(v => console.log('  ', v));
}
console.log(`OK — schema audit complete (migration owned by GR/GI)`);
