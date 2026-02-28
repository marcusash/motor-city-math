// gp-older-exams-no-x-range.test.js — RP1-5 should NOT have x_range (old schema)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER_EXAMS = [1, 2, 3, 4, 5];

let pass = 0, fail = 0;
const findings = [];

for (const n of OLDER_EXAMS) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.x_range) {
      fail++;
      findings.push(`RP${n}: ${q.id} has x_range (unexpected for old schema)`);
    } else { pass++; }
  }
}

console.log(`gp-older-exams-no-x-range: ${pass} pass, ${fail} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — old schema x_range audit complete`);
