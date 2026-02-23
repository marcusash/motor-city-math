// gp-all-section-a-have-hints.test.js — all Section A questions must have hints (Kai needs support entry questions)

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
  for (const q of data.questions.filter(q => q.section === 'A')) {
    if (!q.hint || String(q.hint).trim() === '') {
      fail++;
      failures.push(`${file}: Q${q.id} Section A missing hint`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-section-a-have-hints: ${pass} pass, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section A questions have hints`);
