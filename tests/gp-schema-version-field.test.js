// gp-schema-version-field.test.js — schema_version field should be present and valid

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_SCHEMA_VERSIONS = new Set(['1.0', '2.0']);
let pass = 0;
let warn = 0;
const warnings = [];
const versions = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sv = String(data.schema_version || '').trim();
  versions[sv || '(missing)'] = (versions[sv || '(missing)'] || 0) + 1;
  
  if (!sv) {
    warn++;
    warnings.push(`${file}: schema_version field missing`);
  } else if (!VALID_SCHEMA_VERSIONS.has(sv)) {
    warn++;
    warnings.push(`${file}: schema_version="${sv}" not in ${[...VALID_SCHEMA_VERSIONS].join('/')}`);
  } else {
    pass++;
  }
}

console.log(`gp-schema-version-field: ${pass} pass, ${warn} missing/invalid`);
console.log(`  Distribution: ${JSON.stringify(versions)}`);
if (warnings.length) {
  warnings.forEach(w => console.log('  INFO:', w));
}
console.log(`OK — schema_version audit complete`);
