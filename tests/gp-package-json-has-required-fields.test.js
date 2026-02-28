// gp-package-json-has-required-fields.test.js — package.json key field audit

const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

const CRITICAL_FIELDS = ['scripts'];       // must have
const OPTIONAL_FIELDS = ['name', 'version', 'description', 'engines']; // good to have

let pass = 0;
let fail = 0;
let warn = 0;
const failures = [];
const warnings = [];

for (const field of CRITICAL_FIELDS) {
  if (!pkg[field]) { fail++; failures.push(`package.json: missing critical field "${field}"`); }
  else pass++;
}

for (const field of OPTIONAL_FIELDS) {
  if (!pkg[field]) { warn++; warnings.push(`package.json: optional field "${field}" not set`); }
  else pass++;
}

// Verify test script exists
if (pkg.scripts && pkg.scripts.test) {
  pass++;
  console.log(`  scripts.test: "${pkg.scripts.test}"`);
} else {
  fail++;
  failures.push('package.json: scripts.test is missing');
}

console.log(`gp-package-json-has-required-fields: ${pass} pass, ${fail} fail, ${warn} optional missing`);
if (warnings.length) warnings.forEach(w => console.log('  INFO:', w));
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — package.json has all critical fields (${warn} optional fields not set)`);

