// gp-1034-exam-total-graphs-regression.test.js — total graphs across all exams = 22 (2 per exam)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = 22;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) { if (q.graph) total++; }
}

console.log(`gp-1034-exam-total-graphs-regression: total=${total} (expected ${EXPECTED})`);
if (total !== EXPECTED) {
  console.log(`  FAIL: expected ${EXPECTED} graphs, got ${total}`);
  process.exit(1);
}
console.log(`OK — total graph count locked at ${EXPECTED}`);
