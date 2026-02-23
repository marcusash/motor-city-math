// gp-section-a-first-q-is-identify.test.js — first question in every exam should be Section A type

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];
const seen = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q1 = data.questions[0];
  if (!q1 || q1.section !== 'A') {
    fail++;
    failures.push(`${file}: Q1 section="${q1 ? q1.section : 'missing'}" (expected A)`);
  } else {
    seen[q1.type] = (seen[q1.type] || 0) + 1;
    pass++;
  }
}

console.log(`gp-section-a-first-q-is-identify: ${pass} pass, ${fail} wrong`);
console.log(`  Q1 types seen: ${Object.entries(seen).map(([t,c]) => `${t}=${c}`).join(', ')}`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams start with a Section A question`);
