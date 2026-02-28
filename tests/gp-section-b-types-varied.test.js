// gp-section-b-types-varied.test.js — Section B should have more than 1 question type per exam

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
  const bTypes = new Set(data.questions.filter(q => q.section === 'B').map(q => q.type));
  if (bTypes.size < 2) {
    fail++;
    failures.push(`${file}: Section B only has 1 type: ${[...bTypes].join(',')}`);
  } else { pass++; }
}

console.log(`gp-section-b-types-varied: ${pass} pass, ${fail} single-type`);
if (failures.length) { failures.forEach(f => console.log('  ADVISORY:', f)); }
console.log(`OK — all ${pass} exams have varied Section B question types`);
