// gp-q1-always-section-a.test.js — Q1 (index 0) must always be Section A in every exam

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
  const q1 = data.questions[0];
  if (!q1 || q1.section !== 'A') {
    fail++;
    failures.push(`${file}: Q1 (index 0) is section="${q1 ? q1.section : 'missing'}" (expected A)`);
  } else {
    pass++;
  }
}

console.log(`gp-q1-always-section-a: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams start with Section A question`);
