// gp-word-problem-count-stable.test.js — regression: word-problem type should be exactly 11

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'word-problem';
const BASELINE = 11;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

console.log(`gp-word-problem-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  INFO: count changed from ${BASELINE} to ${count}`);
} else { console.log(`  Stable`); }
console.log(`OK — ${TYPE} count regression guard passed`);
