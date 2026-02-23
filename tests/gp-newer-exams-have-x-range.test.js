// gp-newer-exams-have-x-range.test.js — RP6-11 must have x_range on their graphs

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER_EXAMS = [6, 7, 8, 9, 10, 11];

let pass = 0, fail = 0;
const failures = [];

for (const n of NEWER_EXAMS) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (!q.graph.x_range || !Array.isArray(q.graph.x_range) || q.graph.x_range.length !== 2) {
      fail++;
      failures.push(`RP${n}: ${q.id} missing valid x_range`);
    } else { pass++; }
  }
}

console.log(`gp-newer-exams-have-x-range: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graphs in RP6-11 have x_range`);
