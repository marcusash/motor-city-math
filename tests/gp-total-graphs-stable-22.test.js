// gp-total-graphs-stable-22.test.js — regression guard: exactly 22 graphs total

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BASELINE = 22;
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.graph).length;
}

console.log(`gp-total-graphs-stable-22: ${total} graphs (baseline: ${BASELINE})`);
if (total !== BASELINE) {
  console.log(`  FAIL: graph count changed from ${BASELINE} to ${total}`);
  process.exit(1);
}
console.log(`OK — total graph count regression guard passed`);
