// gp-all-section-d-have-hints.test.js — all Section D questions must have non-empty hints

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'D')) {
    if (!q.hint || String(q.hint).trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} Section D question missing hint`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-section-d-have-hints: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section D questions have hints`);
