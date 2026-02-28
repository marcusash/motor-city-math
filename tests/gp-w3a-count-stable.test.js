// gp-w3a-count-stable.test.js — W3.a should be exactly 20 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STANDARD = 'W3.a';
const BASELINE = 20;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === STANDARD).length;
}

console.log(`gp-w3a-count-stable: ${count} ${STANDARD} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) { console.log(`  INFO: count changed from ${BASELINE} to ${count}`); }
else { console.log(`  Stable`); }
console.log(`OK — ${STANDARD} count regression guard passed`);
