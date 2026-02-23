// gp-questions-in-section-order.test.js — questions must appear in order A, then B, then C, then D

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const SECTION_ORDER = { A: 0, B: 1, C: 2, D: 3 };
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let maxSection = -1;
  let examOk = true;
  for (const q of data.questions) {
    const rank = SECTION_ORDER[q.section];
    if (rank === undefined) continue;
    if (rank < maxSection) {
      examOk = false;
      failures.push(`${file}: Q${q.id} section ${q.section} appears after section of higher rank`);
    }
    maxSection = Math.max(maxSection, rank);
  }
  if (examOk) pass++;
  else fail++;
}

console.log(`gp-questions-in-section-order: ${pass} pass, ${fail} out-of-order`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have questions in A→B→C→D order`);
