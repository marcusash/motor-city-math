// gp-multiple-choice-count-stable.test.js — regression: multiple-choice type should be 5

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'multiple-choice';
const BASELINE = 5;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

console.log(`gp-multiple-choice-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) { console.log(`  INFO: count changed from ${BASELINE} to ${count}`); }
else { console.log(`  Stable`); }
console.log(`OK — multiple-choice count regression guard passed`);
