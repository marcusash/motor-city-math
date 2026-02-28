// gp-q4-through-q11-section-b.test.js — Q4-Q11 (indices 3-10) must all be Section B

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
  for (let i = 3; i <= 10; i++) {
    const q = data.questions[i];
    if (!q) { fail++; failures.push(`${file}: Q${i+1} not found`); continue; }
    if (q.section !== 'B') {
      fail++;
      failures.push(`${file}: Q${i+1} (id=${q.id}) in Section ${q.section} (expected B)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-q4-through-q11-section-b: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Q4-Q11 across 11 exams are in Section B`);
