// gp-section-a-first-3-positions.test.js — first 3 questions in every exam must be Section A

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
  const first3 = data.questions.slice(0, 3);
  for (let i = 0; i < first3.length; i++) {
    const q = first3[i];
    if (q.section !== 'A') {
      fail++;
      failures.push(`${file}: Q${i+1} (index ${i}) is section="${q.section}" (expected A)`);
    } else { pass++; }
  }
}

console.log(`gp-section-a-first-3-positions: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} first-3 question slots are Section A`);
