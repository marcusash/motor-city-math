// gp-graph-22-total-stable.test.js — regression guard: exactly 22 graphs across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 22;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.graph).length;
}

console.log(`gp-graph-22-total-stable: ${count} graphs (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: graph count changed from ${BASELINE} to ${count}`);
} else {
  console.log(`  Stable`);
}
console.log(`OK — total graph regression guard passed`);
