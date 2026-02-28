// gp-all-graphs-q12-or-q13.test.js — graphs only appear on Q12 (index 11) or Q13 (index 12)

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
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    if (!q.graph) continue;
    if (i !== 11 && i !== 12) {
      fail++;
      failures.push(`${file}: Q${q.id} at index ${i} has a graph (expected only index 11-12)`);
    } else { pass++; }
  }
}

console.log(`gp-all-graphs-q12-or-q13: ${pass} pass, ${fail} misplaced`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs are at Q12 or Q13 positions (indices 11-12)`);
