// gp-1021-no-duplicate-standards-per-question.test.js — each question should have exactly one standard

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
  for (const q of data.questions) {
    const std = q.standard;
    if (typeof std === 'string' && std.length > 0) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} standard="${std}" (invalid)`); }
  }
}

console.log(`gp-1021-no-duplicate-standards-per-question: ${pass} valid, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have a valid standard string`);
