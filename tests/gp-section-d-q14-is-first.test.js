// gp-section-d-q14-is-first.test.js — Section D should start at index 13 (Q14)

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
  const q14 = data.questions[13];
  if (!q14 || q14.section !== 'D') {
    fail++;
    failures.push(`${file}: Q14 (index 13) is section="${q14 ? q14.section : 'missing'}" (expected D)`);
  } else { pass++; }
}

console.log(`gp-section-d-q14-is-first: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams start Section D at Q14 (index 13)`);
