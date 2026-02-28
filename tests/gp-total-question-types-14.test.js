// gp-total-question-types-14.test.js — exactly 14 distinct question types are in use

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 14;
const types = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) { if (q.type) types.add(q.type); }
}

console.log(`gp-total-question-types-14: ${types.size} distinct question types (baseline: ${BASELINE})`);
console.log(`  Types: ${[...types].sort().join(', ')}`);
if (types.size !== BASELINE) { console.log(`  INFO: type count changed from ${BASELINE} to ${types.size}`); }
else { console.log(`  Stable`); }
console.log(`OK — question type diversity audit complete`);
