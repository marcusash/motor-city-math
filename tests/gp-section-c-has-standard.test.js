// gp-section-c-has-standard.test.js — all Section C questions must have a valid standard

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STANDARD_RE = /^W[23]\.[a-f]$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'C')) {
    if (!q.standard || !STANDARD_RE.test(q.standard)) {
      fail++;
      failures.push(`${file}: Q${q.id} (Section C) standard="${q.standard}" invalid`);
    } else { pass++; }
  }
}

console.log(`gp-section-c-has-standard: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section C questions have valid standards`);
