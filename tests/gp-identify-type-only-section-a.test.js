// gp-identify-type-only-section-a.test.js — "identify" type questions should only appear in Section A

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
    if (q.type !== 'identify') continue;
    if (q.section !== 'A') {
      fail++;
      failures.push(`${file}: ${q.id} is type "identify" but in Section ${q.section} (expected A)`);
    } else { pass++; }
  }
}

console.log(`gp-identify-type-only-section-a: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} "identify" type questions are in Section A`);
