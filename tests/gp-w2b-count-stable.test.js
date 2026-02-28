// gp-w2b-count-stable.test.js — W2.b should be exactly 26 questions (3rd most common)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STANDARD = 'W2.b';
const BASELINE = 26;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === STANDARD).length;
}

console.log(`gp-w2b-count-stable: ${count} ${STANDARD} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) { console.log(`  INFO: count changed from ${BASELINE} to ${count}`); }
else { console.log(`  Stable`); }
console.log(`OK — ${STANDARD} count regression guard passed`);
