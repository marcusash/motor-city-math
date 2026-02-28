// gp-all-sections-valid-values.test.js — section field must be A, B, C, or D

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID = new Set(['A', 'B', 'C', 'D']);
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!VALID.has(q.section)) {
      fail++;
      failures.push(`${file}: Q${q.id} has invalid section="${q.section}"`);
    } else { pass++; }
  }
}

console.log(`gp-all-sections-valid-values: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have valid section values (A/B/C/D)`);
