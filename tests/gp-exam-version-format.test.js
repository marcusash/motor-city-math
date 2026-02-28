// gp-exam-version-format.test.js — version field must match "N.N" pattern

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VERSION_RE = /^\d+\.\d+$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const v = data.version;
  if (!v || !VERSION_RE.test(String(v))) {
    fail++;
    failures.push(`${file}: version="${v}" does not match N.N format`);
  } else { pass++; }
}

console.log(`gp-exam-version-format: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have valid N.N version format`);
