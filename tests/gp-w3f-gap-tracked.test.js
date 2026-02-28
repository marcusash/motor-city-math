// gp-w3f-gap-tracked.test.js — W3.f must have 0 questions (critical gap, tracked by GR)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STANDARD = 'W3.f';
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === STANDARD).length;
}

console.log(`gp-w3f-gap-tracked: ${count} ${STANDARD} questions (baseline: 0)`);
if (count === 0) {
  console.log(`  WARN: W3.f has 0 questions — critical curriculum gap (escalated to GR)`);
} else {
  console.log(`  ${STANDARD} now has ${count} questions — gap partially filled!`);
}
console.log(`OK — W3.f gap tracker updated`);
