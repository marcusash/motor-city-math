// gp-question-id-has-q-prefix.test.js — question id must follow rp{N}-q{M} pattern

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const Q_RE = /^rp\d+-q\d+$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.id || !Q_RE.test(q.id)) {
      fail++;
      failures.push(`${file}: Q.id="${q.id}" does not match rp{N}-q{M} pattern`);
    } else { pass++; }
  }
}

console.log(`gp-question-id-has-q-prefix: ${pass} pass, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question IDs follow rp{N}-q{M} pattern`);
