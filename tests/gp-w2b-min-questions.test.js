// gp-w2b-min-questions.test.js — W2.b must have at least 20 questions (it's the leading standard)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STANDARD = 'W2.b';
const MIN_QUESTIONS = 20;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === STANDARD).length;
}

console.log(`gp-w2b-min-questions: ${total} ${STANDARD} questions (min: ${MIN_QUESTIONS})`);
if (total < MIN_QUESTIONS) {
  console.log(`  FAIL: only ${total} ${STANDARD} questions (expected >= ${MIN_QUESTIONS})`);
  process.exit(1);
}
console.log(`OK — ${STANDARD} coverage meets minimum threshold`);
