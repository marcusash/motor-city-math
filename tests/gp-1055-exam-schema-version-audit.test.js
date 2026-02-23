// gp-1055-exam-schema-version-audit.test.js — schema_version 1.0 for RP1-10, 2.0 for RP11

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const n = parseInt(file.match(/retake-practice-(\d+)\.json/)[1]);
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const expectedSV = n <= 10 ? '1.0' : '2.0';
  if (data.schema_version === expectedSV) { pass++; }
  else { fail++; failures.push(`${file}: schema_version="${data.schema_version}" (expected "${expectedSV}")`); }
}

console.log(`gp-1055-exam-schema-version-audit: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have correct schema_version (RP1-10=1.0, RP11=2.0)`);
