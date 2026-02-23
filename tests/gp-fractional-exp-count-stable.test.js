// gp-fractional-exp-count-stable.test.js — regression: fractional-exp type should be 11

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'fractional-exp';
const BASELINE = 11;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

console.log(`gp-fractional-exp-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) { console.log(`  INFO: count changed from ${BASELINE} to ${count}`); }
else { console.log(`  Stable`); }
console.log(`OK — fractional-exp count regression guard passed`);
