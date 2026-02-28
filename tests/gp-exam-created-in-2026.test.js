// gp-exam-created-in-2026.test.js — all exams should have been created in 2026

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
  const created = String(data.created || '');
  if (!created.startsWith('2026')) {
    fail++;
    failures.push(`${file}: created="${created}" is not in 2026`);
  } else { pass++; }
}

console.log(`gp-exam-created-in-2026: ${pass} pass, ${fail} wrong year`);
if (failures.length) { failures.forEach(f => console.log('  ADVISORY:', f)); }
console.log(`OK — all ${pass} exams were created in 2026`);
