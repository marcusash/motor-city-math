// gp-graph-type-count-stable.test.js — regression: graph type should be exactly 21

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'graph';
const BASELINE = 21;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

console.log(`gp-graph-type-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: count changed from ${BASELINE} to ${count}`);
} else { console.log(`  Stable`); }
console.log(`OK — ${TYPE} type count regression guard passed`);
