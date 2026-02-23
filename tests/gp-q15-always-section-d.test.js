// gp-q15-always-section-d.test.js — Q15 (index 14, last question) must always be Section D

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
  const q15 = data.questions[14];
  if (!q15 || q15.section !== 'D') {
    fail++;
    failures.push(`${file}: Q15 (index 14) is section="${q15 ? q15.section : 'missing'}" (expected D)`);
  } else {
    pass++;
  }
}

console.log(`gp-q15-always-section-d: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams end with Section D question`);
