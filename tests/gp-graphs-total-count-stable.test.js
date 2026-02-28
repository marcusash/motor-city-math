// gp-graphs-total-count-stable.test.js — total graph count across all exams should be 22 (2 per exam)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_GRAPHS = 22;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.graph).length;
}

console.log(`gp-graphs-total-count-stable: ${total} graphs (baseline: ${EXPECTED_GRAPHS})`);
if (total < EXPECTED_GRAPHS) {
  console.log(`  FAIL: only ${total} graphs — ${EXPECTED_GRAPHS - total} missing!`);
  process.exit(1);
}
if (total > EXPECTED_GRAPHS) {
  console.log(`  INFO: ${total} graphs (${total - EXPECTED_GRAPHS} added since baseline)`);
}
console.log(`OK — graph count stable at ${total}`);
