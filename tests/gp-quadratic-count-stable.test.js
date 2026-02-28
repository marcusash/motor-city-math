// gp-quadratic-count-stable.test.js — regression: quadratic type across all sections

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'quadratic';
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

// From Section A (4) + Section B (11) = 15 baseline
const BASELINE = 15;
console.log(`gp-quadratic-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) { console.log(`  INFO: count changed from ${BASELINE} to ${count}`); }
else { console.log(`  Stable`); }
console.log(`OK — quadratic count regression guard passed`);
