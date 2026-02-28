// gp-no-section-x-or-unknown.test.js — questions must not have undefined, null, or unknown section values

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID = new Set(['A', 'B', 'C', 'D']);
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.section || !VALID.has(q.section)) {
      fail++;
      failures.push(`${file}: Q${q.id} has section=${JSON.stringify(q.section)} (not A/B/C/D)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-section-x-or-unknown: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have valid section (A/B/C/D)`);
