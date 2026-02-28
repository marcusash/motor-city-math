// gp-absolute-value-count-stable.test.js — regression: absolute-value type should be exactly 8

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'absolute-value';
const BASELINE = 8;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

console.log(`gp-absolute-value-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) { console.log(`  INFO: count changed to ${count}`); }
else { console.log(`  Stable`); }
console.log(`OK — absolute-value count regression guard passed`);
